import React, {Suspense, useEffect, useRef, useState} from 'react';
import {Alert, Box, Button, DialogActions, DialogContent, DialogContentText, Snackbar} from '@mui/material';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import FridgeModel from './FridgeModel';
import Rig from './Rig';
import MBTIModel from './MBTIModel';
import * as THREE from 'three';
import Loader from './Loader';
import TrashcanModel from './TrashcanModel';
import ENV_URL from 'assets/brown_photostudio_02_4k.exr';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';
import {OrbitControls, useGLTF} from '@react-three/drei';
import { useWebSocket } from '../../context/WebSocketContext';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import Dialog from "@mui/material/Dialog";
import { useSelector } from 'react-redux';

function Environment() {
	const { scene } = useThree();
	const exrTexture = useLoader(EXRLoader, ENV_URL);


	useEffect(() => {

		exrTexture.mapping = THREE.EquirectangularReflectionMapping;
		scene.environment = exrTexture;
	}, [exrTexture, scene]);

	return null;
}

function ModifyFridge({setOpenInside}) {
	const pointLightRef = useRef();
	const [fridgeUuid, setFridgeUuid] = React.useState(null);
	const { roomStatus } = useWebSocket();
	const [models, setModels] = useState([]);
	const [isSaved, setIsSaved] = useState(true);
	const [openDialog, setOpenDialog] = useState(false);
	const [openSaved, setOpenSaved] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const {isLoggedIn} = useSelector(state => state.auth);
	const [isCanvasLoaded, setIsCanvasLoaded] = useState(false);
	const navigate = useNavigate();

	const handleSave = () => {
		if (models.length >= 0) {
			const requestObj = models.map(model => ({
				src: model.url,
				posX: model.object.position.x,
				posY: model.object.position.y
			}));
			axios.put(`${process.env.REACT_APP_API_URL}/refrigerator/addCustomobjs`, requestObj, {
				headers: {
					'Authorization': localStorage.getItem('authHeader'),
				}
			})
				.then(() => {
					setIsSaved(true);
					setOpenSaved(true);
				})
				.catch((err) => {
					console.log(err);
				});
		}
		// axios.post(`${process.env.REACT_APP_API_URL}/refrigerator/addCustomobjs`, {})
	}

	const handleInsideWithSave = () => {
		handleSave();
		setOpenInside(true);
	}
	const handleInsideWithoutSave = () => {
		setOpenInside(true);
	}

	useEffect(() => {
		setIsLoading(true);
		const loadModel = (url) => {
			return new Promise((resolve, reject) => {
				const loader = new GLTFLoader();
				loader.load(`/${url}`, resolve, undefined, reject);
			});
		};
		axios.post(`${process.env.REACT_APP_API_URL}/user/myId`, null, {
			headers: {
				'Authorization': localStorage.getItem('authHeader'),
			}
		}).then(response => {
			axios.get(`${process.env.REACT_APP_API_URL}/refrigerator/object/${response.data}`).then(
				async (response) => {
					const promises = response.data.objs.map(obj=> loadModel(obj.src).then(gltf => ({
						isNew: false,
						object: gltf.scene,
						position: [obj.posX, obj.posY, 1.4],
						url: obj.src
					})));
					Promise.all(promises).then(modelData => {
						setModels(modelData);
					});
				});
		}).catch((err) => {
			alert('로그인이 필요합니다.');
			if (err.response.status === 403) {
				navigate('/login');
			}
		});
	}, []);

	useEffect(() => {
		if (pointLightRef.current) {
			pointLightRef.current.shadow.mapSize.width = 2048; // 그림자 맵의 너비 설정
			pointLightRef.current.shadow.mapSize.height = 2048; // 그림자 맵의 높이 설정
		}
	}, [pointLightRef]);

	return (
		<>
			<Canvas camera={{ position: [0, 0, 6], fov: 60 }} shadows antialias='true' onCreated={() => setIsCanvasLoaded(true)}>
				<pointLight ref={pointLightRef} position={[5, 5, 5]} intensity={100} castShadow/>
				<Rig/>
				<Suspense fallback={<Loader setIsLoading={setIsLoading}/>}>
					<Environment />
				</Suspense>
				<Suspense fallback={<Loader setIsLoading={setIsLoading}/>}>
					<FridgeModel setUuid={setFridgeUuid}/>
				</Suspense>
				<Suspense fallback={<Loader setIsLoading={setIsLoading}/>}>
					<TrashcanModel initialPosition={[-2.5, -1.5, 1]} setModels={setModels} models={models} setIsSaved={setIsSaved}/>
				</Suspense>
				<Suspense fallback={<Loader setIsLoading={setIsLoading}/>}>
					<MBTIModel initialPosition={[2, 1.7, 0]} fridgeUuid={fridgeUuid} models={models} setModels={setModels} setIsSaved={setIsSaved}/>
				</Suspense>


			</Canvas>
			{ isCanvasLoaded &&
				<Box sx={{width: '200px', position: 'absolute', top: '90%', left: '90%', transform: 'translate(-50%, -50%)', padding: '20px'}}>
					<Button onClick={handleSave}>저장</Button>
					<Button onClick={() => {
						if (isSaved) setOpenInside(true);
						else setOpenDialog(true);
					}}>내부로 이동</Button>
				</Box>
			}
			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				open={openSaved}
				autoHideDuration={3000}
				onClose={() => {
					setOpenSaved(false);
				}}
			>
				<Alert
					onClose={() => {
						setOpenSaved(false);
					}}
					severity="success"
					variant="filled"
				>저장 완료!</Alert>
			</Snackbar>
			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						내부로 이동하기 전에 저장하시겠습니까?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleInsideWithSave}>네</Button>
					<Button onClick={handleInsideWithoutSave} autoFocus>
						아니오
					</Button>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default ModifyFridge;