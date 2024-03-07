import React, {Suspense, useEffect, useRef, useState} from 'react';
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
    DialogContent, DialogContentText, DialogActions
} from '@mui/material';
import {Canvas, useFrame, useLoader, useThree} from '@react-three/fiber';
import FridgeInsideModel from './FridgeInsideModel';
import Rig from './Rig';
import MBTIModel from './MBTIModel';
import * as THREE from 'three';
import Loader from './Loader';
import TrashcanModel from './TrashcanModel';
import ENV_URL from 'assets/brown_photostudio_02_4k.exr';
import {EXRLoader} from 'three/examples/jsm/loaders/EXRLoader';
import {Html, OrbitControls} from '@react-three/drei';
import {useWebSocket} from '../../context/WebSocketContext';
import AddButtonModel from "./addButtonModel";
import axios from "axios";
import BottleModel from "./BottleModel";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Dialog from "@mui/material/Dialog";
import {useNavigate} from "react-router-dom";
import ModifyFridge from './ModifyFridge';

function Environment() {
    const {scene} = useThree();
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
        camera.fov = 40;
    }, []);


    useEffect(() => {
        if (!isLoading) {
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

function ModifyFridgeInside({ setOpenInside }) {
    const pointLightRef = useRef();
    const [fridgeUuid, setFridgeUuid] = React.useState(null);
    const {roomStatus} = useWebSocket();
    const [models, setModels] = useState([]);
    const [cell, setCell] = useState(0);
    const [drinks, setDrinks] = useState([]);
    const [showAddDrinkUI, setShowAddDrinkUI] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDrink, setSelectedDrink] = useState(null);
    const [clickedDrink, setClickedDrink] = useState(null);
    const [clickedDrinkInfo, setClickedDrinkInfo] = useState(null);
    const [isCanvasLoaded, setIsCanvasLoaded] = useState(false);
    const [isAdded, setIsAdded] = useState(false);
    const [isSaved, setIsSaved] = useState(true);
    const [openSaved, setOpenSaved] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const category = ['Gin', 'Rum', 'Vodka', 'Whiskey', 'Tequila', 'Brandy', 'Liqueur', 'Beer', 'Soju'];

    useEffect(() => {
        setModels([]);
        axios.post(`${process.env.REACT_APP_API_URL}/user/myId`, null, {
            headers: {
                'Authorization': localStorage.getItem('authHeader'),
            }
        }).then(response => {
            axios.get(`${process.env.REACT_APP_API_URL}/refrigerator/drink/${response.data}`).then(
                (response) => {
                    response.data.forEach((drink) => {
                        setModels(prevState => [...prevState, drink.drink]);
                    });
                }).catch((error) => {
                console.log(error);
            });
            }).catch((error) => {
                alert('로그인이 필요합니다.');
                navigate('/login');
                console.log(error);
            });
    }, []);

    useEffect(() => {
        if (pointLightRef.current) {
            pointLightRef.current.shadow.mapSize.width = 2048; // 그림자 맵의 너비 설정
            pointLightRef.current.shadow.mapSize.height = 2048; // 그림자 맵의 높이 설정
        }
    }, [pointLightRef]);

    useEffect(() => {
        if (models.length % 4 === 0 && cell < 3 && isAdded) {
            setCell(cell + 1);
            setIsAdded(false);
        }
        setIsAdded(false);
    }, [models]);

    useEffect(() => {
        if (!selectedCategory) return;
        const categoryIndex = category.findIndex(c => c === selectedCategory);
        const categoryId = categoryIndex + 1;
        axios.post(`${process.env.REACT_APP_API_URL}/drink/search/category`, categoryId,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                setDrinks(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, [selectedCategory])

    const handleAddClick = () => {
        setShowAddDrinkUI(true);
    }

    const handleInsideWithSave = () => {
        handleSave();
        setOpenInside(false);
    }
    const handleInsideWithoutSave = () => {
        setOpenInside(false);
    }

    const handleBottleClick = (index) => {
        setClickedDrink(index);

        axios.get(`${process.env.REACT_APP_API_URL}/drink/${models[index].id}`).then(response => {
            setClickedDrinkInfo(response.data);
        })
    }

    const handleDeleteClick = () => {
        const updateModels = models.filter((_, index) => index !== clickedDrink);

        setModels(updateModels);
        setIsSaved(false);

        setClickedDrinkInfo(null);
        setClickedDrink(null);
    }

    const handleSave = () => {
        if (models.length >= 0) {
            axios.put(`${process.env.REACT_APP_API_URL}/refrigerator/addDrinks`, models.map(model => model.id), {
                headers: {
                    'Authorization': localStorage.getItem('authHeader'),
                }
            }).then(() => {
                setIsSaved(true);
                setOpenSaved(true);
            }).catch((err) => {
               console.log(err);
            });
        }
    }

    const renderAddDrinkUI = () => {
        if (!showAddDrinkUI) return null;

        return (
            <Box sx={{width: '300px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
            <FormControl fullWidth>
                <InputLabel id="category-select-label">카테고리</InputLabel>
                <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={selectedCategory}
                    label="카테고리"
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                    {category.map((c, index) => <MenuItem key={index} value={c}>{c}</MenuItem>)}
                </Select>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel id="drink-select-label">술</InputLabel>
                <Select
                    labelId="drink-select-label"
                    id="drink-select"
                    value={selectedDrink}
                    label="술"
                    onChange={(e) => {
                        setSelectedDrink(e.target.value)
                    }}
                    >
                    {drinks.map((drink) => <MenuItem key={drink.id} value={drink}>{drink.name}</MenuItem>)}
                </Select>
            </FormControl>
            <Button onClick={() => {
                setIsAdded(true);
                if (models.length === 16) return;
                if (selectedDrink === null) return;
                setModels([...models, selectedDrink]);
                setIsSaved(false);
                setSelectedCategory(null);
                setSelectedDrink(null);
                setDrinks([]);
                setShowAddDrinkUI(false);
            }}>추가하기</Button>
            <Button onClick={() => {
                setShowAddDrinkUI(false);
                setSelectedCategory(null);
                setSelectedDrink(null);
            }}>취소</Button>
            </Box>
        )
    }

    return (
        <>
            <Canvas camera={{ fov: 50 }} shadows antialias='true' onCreated={() => setIsCanvasLoaded(true)}>
                {/*<OrbitControls />*/}
                {/*<ambientLight intensity={0.5}/>*/}
                {/*<spotLight position={[-3, 3, 3]} angle={0.15} penumbra={0.5} castShadow/>*/}
                {/*<directionalLight ref={directionalLightRef} position={[10, 5, 5]} intensity={5} castShadow/>*/}
                <pointLight ref={pointLightRef} position={[0, 5, 0]} intensity={10} castShadow/>
                <Suspense fallback={<Loader setIsLoading={setIsLoading}/>}>
                    <FridgeInsideModel setUuid={setFridgeUuid}/>
                    <AddButtonModel models={models} onAddClick={handleAddClick}/>
                    <BottleModel models={models} onBottleClick={handleBottleClick}/>
                    <Environment/>
                </Suspense>
                <CameraControl cell={cell} setCell={setCell} isLoading={isLoading}/>
            </Canvas>
            {renderAddDrinkUI()}
            <Box>
                {isCanvasLoaded && cell > 0 &&
                    <IconButton
                        sx={{ position: 'absolute', top: '10%', left: '50%', transform: 'translate(-50%, -50%)' }}
                        onClick={() => {
                            setClickedDrinkInfo(null);
                            setCell(cell - 1);
                        }}
                    >
                        <ExpandLessIcon />
                    </IconButton>
                }
                {isCanvasLoaded && cell < 3 &&
                    <IconButton
                        sx={{ position: 'absolute', top: '90%', left: '50%', transform: 'translate(-50%, -50%)' }}
                        onClick={() => {
                            setClickedDrinkInfo(null);
                            setCell(cell + 1);
                        }}
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                }
            </Box>
            {clickedDrinkInfo &&
                <Box sx={{borderRadius: '20px', position: 'absolute', top: '80%', left: `${clickedDrink % 4 * 20 + 20}%`, transform: 'translate(-50%, -50%)', background: 'rgba(0, 0, 0, 0.3)', padding: '20px'}}>
                    <h2>{clickedDrinkInfo.name}</h2>
                    <p>카테고리: {category[clickedDrinkInfo.category - 1]}</p>
                    <Button onClick={handleDeleteClick}>삭제</Button>
                    <Button onClick={() => {setClickedDrinkInfo(null)}}>닫기</Button>
                </Box>
            }
            <Box sx={{width: '200px', position: 'absolute', top: '90%', left: '90%', transform: 'translate(-50%, -50%)', padding: '20px'}}>
                <Button onClick={handleSave}>저장</Button>
                <Button onClick={() => {
                    if (isSaved) setOpenInside(false);
                    setOpenDialog(true);
                }}>외부로 이동</Button>
            </Box>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                open={openSaved}
                autoHideDuration={3000}
                onClose={() => setOpenSaved(false)}
            >
                <Alert
                    onClose={() => setOpenSaved(false)}
                    severity="success"
                    variant="filled"
                    >저장 완료!</Alert>
            </Snackbar>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        외부로 이동하기 전에 저장하시겠습니까?
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

export default ModifyFridgeInside;