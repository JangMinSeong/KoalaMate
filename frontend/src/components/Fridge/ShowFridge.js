import {Canvas, useLoader, useThree} from "@react-three/fiber";
import {EXRLoader} from "three/examples/jsm/loaders/EXRLoader";
import ENV_URL from "../../assets/brown_photostudio_02_4k.exr";
import React, {Suspense, useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {useWebSocket} from "../../context/WebSocketContext";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {Box, Button} from "@mui/material";
import Loader from "./Loader";
import FridgeModel from "./FridgeModel";
import TrashcanModel from "./TrashcanModel";
import MBTIModel from "./MBTIModel";
import Rig from "./Rig";

function Environment() {
    const { scene } = useThree();
    const exrTexture = useLoader(EXRLoader, ENV_URL);


    useEffect(() => {

        exrTexture.mapping = THREE.EquirectangularReflectionMapping;
        scene.environment = exrTexture;
    }, [exrTexture, scene]);

    return null;
}

function ShowFridge({setOpenInside, userId}) {
    const pointLightRef = useRef();
    const [fridgeUuid, setFridgeUuid] = React.useState(null);
    const { roomStatus } = useWebSocket();
    const [models, setModels] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadModel = (url) => {
            return new Promise((resolve, reject) => {
                const loader = new GLTFLoader();
                loader.load(`/${url}`, resolve, undefined, reject);
            });
        };
        axios.get(`${process.env.REACT_APP_API_URL}/refrigerator/object/${userId}`).then(
            async (response) => {
                console.log(response.data);
                const promises = response.data.objs.map(obj=> loadModel(obj.src).then(gltf => ({
                    isNew: false,
                    object: gltf.scene,
                    position: [obj.posX, obj.posY, 1.4],
                    url: obj.src
                })));
                Promise.all(promises).then(modelData => {
                    setModels(modelData);
                    console.log(modelData);
                });
            }
        )
    }, []);

    useEffect(() => {
        console.log(models);
    }, [models])

    useEffect(() => {
        console.log(roomStatus);
        console.log(pointLightRef.current);
        if (pointLightRef.current) {
            console.log(pointLightRef.current);
            pointLightRef.current.shadow.mapSize.width = 2048; // 그림자 맵의 너비 설정
            pointLightRef.current.shadow.mapSize.height = 2048; // 그림자 맵의 높이 설정
        }
    }, [pointLightRef]);

    return (
      <>
            <Canvas camera={{ position: [0, 0, 6], fov: 60 }} shadows antialias='true' colorManagement={true} shadowMap={{ type: THREE.VSMShadowMap }}>
                {/*<OrbitControls />*/}
                {/*<ambientLight intensity={0.5}/>*/}
                {/*<spotLight position={[-3, 3, 3]} angle={0.15} penumbra={0.5} castShadow/>*/}
                {/*<directionalLight ref={directionalLightRef} position={[10, 5, 5]} intensity={5} castShadow/>*/}
                <pointLight ref={pointLightRef} position={[5, 5, 5]} intensity={100} castShadow/>
                <Suspense fallback={<Loader/>}>
                    <FridgeModel setUuid={setFridgeUuid}/>
                    {/*<MBTIModel initialPosition={[2, 1.7, 0]} fridgeUuid={fridgeUuid} models={models} setModels={setModels}/>*/}
                    <Rig/>
                    <Environment />
                    {models.map((model) => (
                        <primitive object={model.object} key={model.object.uuid} position={model.position}/>
                    ))}
                </Suspense>
            </Canvas>
            <Box sx={{
                width: '200px',
                position: 'absolute',
                top: '90%',
                left: '90%',
                transform: 'translate(-50%, -50%)',
                padding: '20px'
            }}>
                <Button onClick={() => {
                    setOpenInside(true);
                }}>내부로 이동</Button>
            </Box>
          </>
    )
}

export default ShowFridge;