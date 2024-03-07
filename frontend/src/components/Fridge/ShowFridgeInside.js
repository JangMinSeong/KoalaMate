import React, { Suspense, useEffect, useRef, useState } from 'react';
import {
	Box,
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	IconButton,
	Snackbar,
	Alert,
	DialogContent, DialogContentText, DialogActions,
} from '@mui/material';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import FridgeInsideModel from './FridgeInsideModel';
import Rig from './Rig';
import MBTIModel from './MBTIModel';
import * as THREE from 'three';
import Loader from './Loader';
import TrashcanModel from './TrashcanModel';
import ENV_URL from 'assets/brown_photostudio_02_4k.exr';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';
import { Html, OrbitControls } from '@react-three/drei';
import { useWebSocket } from '../../context/WebSocketContext';
import AddButtonModel from './addButtonModel';
import axios from 'axios';
import BottleModel from './BottleModel';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Dialog from '@mui/material/Dialog';
import { useNavigate, useParams } from 'react-router-dom';

function Environment () {
	const { scene } = useThree();
	const exrTexture = useLoader(EXRLoader, ENV_URL);

	useEffect(() => {

		exrTexture.mapping = THREE.EquirectangularReflectionMapping;
		scene.environment = exrTexture;
	}, [exrTexture, scene]);

	return null;
}

const CameraControl = ({ cell, setCell, isLoading }) => {
	const camera = useThree((state) => state.camera);

	useEffect(() => {
		camera.fov = 60;
	}, []);


	useEffect(() => {
		console.log(!isLoading);
		if (!isLoading) {
			console.log("asdf");
			camera.position.set(0, 0, 0.6);
			camera.rotation.set(-0.17, 0, 0);
		}
	}, [!isLoading])

	useFrame(() => {
		// 카메라의 Y 위치를 조정하여 '올라가기'와 '내려가기' 기능을 구현합니다.
		// camera.position.y = 1.5 - (cell * 0.86); // 여기서 cell 값에 따라 카메라의 Y 위치를 조정합니다.
		if (!isLoading) {
			const targetY = 1.5 - (cell * 0.86);
			camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
		}

	});

	// HTML 요소를 3D 캔버스 외부에 배치하여 화면에 고정되도록 합니다.
	return null; // HTML 요소는 이 컴포넌트 밖에서 직접 렌더링합니다.
};

function ShowFridgeInside ({ setOpenInside, userId }) {
	const pointLightRef = useRef();
	const { roomStatus } = useWebSocket();
	const [models, setModels] = useState([]);
	const [fridgeUuid, setFridgeUuid] = React.useState(null);
	const [cell, setCell] = useState(0);
	const [clickedDrinkInfo, setClickedDrinkInfo] = useState(null);
	const [isCanvasLoaded, setIsCanvasLoaded] = useState(false);
	const [isSaved, setIsSaved] = useState(true);
	const [clickedDrink, setClickedDrink] = useState(-1);
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const category = [
		'Gin',
		'Rum',
		'Vodka',
		'Whiskey',
		'Tequila',
		'Brandy',
		'Liqueur',
		'Beer',
		'Soju'];

	useEffect(() => {
		setModels([]);
		axios.get(`${process.env.REACT_APP_API_URL}/refrigerator/drink/${userId}`)
			.then(
				(response) => {
					response.data.forEach((drink) => {
						console.log(drink);
						setModels(prevState => [...prevState, drink.drink]);
					});
				})
			.catch((error) => {
				console.log(error);
			});
	}, []);

	useEffect(() => {
		console.log(roomStatus);
		console.log(pointLightRef.current);
		if (pointLightRef.current) {
			console.log(pointLightRef.current);
			pointLightRef.current.shadow.mapSize.width = 2048; // 그림자 맵의 너비 설정
			pointLightRef.current.shadow.mapSize.height = 2048; // 그림자 맵의 높이 설정
		}
	}, [pointLightRef]);

	const handleBottleClick = (index) => {
		console.log('clicked index: ', index);
		setClickedDrink(index);

		axios.get(`${process.env.REACT_APP_API_URL}/drink/${models[index].id}`)
			.then(response => {
				console.log(response.data);
				setClickedDrinkInfo(response.data);
			});
	};

	return (
		<>
			<Canvas
				camera={{ fov: 50}}
				shadows antialias="true"
				onCreated={() => setIsCanvasLoaded(true)}>
				{/*<OrbitControls />*/}
				{/*<ambientLight intensity={0.5}/>*/}
				{/*<spotLight position={[-3, 3, 3]} angle={0.15} penumbra={0.5} castShadow/>*/}
				{/*<directionalLight ref={directionalLightRef} position={[10, 5, 5]} intensity={5} castShadow/>*/}
				<pointLight ref={pointLightRef} position={[0, 5, 0]} intensity={10}
				            castShadow/>
				<Suspense fallback={<Loader setIsLoading={setIsLoading}/>}>
					<FridgeInsideModel setFridgeUuid={setFridgeUuid}/>
					<BottleModel models={models} onBottleClick={handleBottleClick}/>
					<Environment/>
				</Suspense>
				<CameraControl cell={cell} setCell={setCell} isLoading={isLoading}/>
			</Canvas>
			<Box>
				{isCanvasLoaded && cell > 0 &&
					<IconButton
						sx={{
							position: 'absolute',
							top: '10%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
						}}
						onClick={() => {
							setCell(cell - 1);
							setClickedDrinkInfo(null);
						}}
					>
						<ExpandLessIcon/>
					</IconButton>
				}
				{isCanvasLoaded && cell < 3 &&
					<IconButton
						sx={{
							position: 'absolute',
							top: '90%',
							left: '50%',
							transform: 'translate(-50%, -50%)',
						}}
						onClick={() => {
							setCell(cell + 1);
							setClickedDrinkInfo(null);
						}}
					>
						<ExpandMoreIcon/>
					</IconButton>
				}
			</Box>
			{clickedDrinkInfo &&
				<Box sx={{
					borderRadius: '20px',
					position: 'absolute',
					top: `80%`, // 마우스 Y 위치 사용
					left: `${clickedDrink % 4 * 20 + 20}%`, // 마우스 X 위치 사용
					// top: '80%',
					// left: '40%',
					transform: 'translate(-50%, -50%)',
					background: 'rgba(0, 0, 0, 0.3)',
					padding: '20px',
				}}>
					<h2>{clickedDrinkInfo.name}</h2>
					<p>카테고리: {category[clickedDrinkInfo.category - 1]}</p>
					<Button onClick={() => {
						setClickedDrinkInfo(null);
					}}>닫기</Button>
				</Box>
			}
			<Box sx={{
				width: '200px',
				position: 'absolute',
				top: '90%',
				left: '90%',
				transform: 'translate(-50%, -50%)',
				padding: '20px',
			}}>
				<Button onClick={() => {
					setOpenInside(false);
				}}>외부로 이동</Button>
			</Box>
		</>
	);
}

export default ShowFridgeInside;