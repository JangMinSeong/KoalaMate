import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import {AnimationMixer, LoopRepeat, LoopOnce } from 'three';
import LinearProgress from '@mui/material/LinearProgress';

import refrigerator from 'assets/refrigerator_prev.glb';
import {Box, Typography} from '@mui/material';

function LinearProgressWithLabel(props) {
	return (
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<Box sx={{ width: '300px', mr: 1 }}>
					<LinearProgress variant="determinate" {...props} />
				</Box>
				<Box sx={{ minWidth: 35 }}>
					<Typography variant="body2" color="white">{`${Math.round(
							props.value,
					)}%`}</Typography>
				</Box>
			</Box>
	);
}

function GLBLoaderComponent() {
	const mountRef = useRef(null);
	const gltfRef = useRef(null);
	const mixerRef = useRef(null);
	const actionRef = useRef(null);
	const cameraRef = useRef(null);

	const [isLoading, setIsLoading] = useState(true);
	const [loadingProgress, setLoadingProgress] = useState(0);

	const clock = new THREE.Clock();
	const raycaster = new THREE.Raycaster();
	const mouse = new THREE.Vector2();

	useEffect(() => {
		if (!mountRef.current) return;
		const currentMount = mountRef.current;
		const scene = new THREE.Scene();
		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		currentMount.appendChild(renderer.domElement);

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);

		const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
		cameraRef.current = camera;
		camera.position.set(10, 0.5, 0);
		camera.lookAt(0, 0.5, 0);

		const loader = new GLTFLoader();
		loader.load(refrigerator, function (gltf) {
			gltfRef.current = gltf;
			scene.add(gltf.scene);

			const mixer = new AnimationMixer(gltf.scene);
			mixerRef.current = mixer;

			if (gltf.animations.length > 0) {
				const action = mixer.clipAction(gltf.animations[0]);
				action.setLoop(LoopRepeat);
				actionRef.current = action;
			}

			if (gltf.scenes && gltf.scenes.length > 0) {
				gltf.scenes.forEach((scene) => {
					scene.traverse((node) => {
						if (node.isLight) {
		//					console.log(node);
							node.intensity *= 0.07;
							scene.add(node);
						}
					});
				});
			}

	//		console.log("asdfasdfasdfasdf");

			setIsLoading(false);
		},
				function (xhr) {
			//if (xhr.total === 0) return;
			const progress = (xhr.loaded / 18143484/*xhr.total*/) * 100;
				setLoadingProgress(progress);
	//			console.log(`${progress}% loaded`)
			},
			function (error) {
				console.error('Error loading gltf', error);
			}
		);

		const onMouseClick = (event) => {

			if (!gltfRef.current) return;

			mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
			mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

			raycaster.setFromCamera(mouse, camera);
			const intersects = raycaster.intersectObjects(gltfRef.current.scene.children, true);

			if (intersects.length > 0) {
				intersects[0].object.material.color.set((Math.random() * 0xffffff));
			}

			if (gltfRef.current.animations.length === 1) {
				actionRef.current = mixerRef.current.clipAction(gltfRef.current.animations[0]);
				actionRef.current.setLoop(LoopOnce);
			}
	//		console.log(actionRef.current);
			actionRef.current.stop();
			actionRef.current.play();
		};
		window.addEventListener('mousedown', onMouseClick, false);

		const onRightClick = (event) => {
			event.preventDefault();
	//		console.log(gltfRef.current);

			let newColorValue = Math.random() * 0xffffff;
			gltfRef.current.scene.traverse(function (object) {
				if (object.isMesh && object.name.includes('Fridge')) {
					object.material.color.set(newColorValue);
				}
			})
		}
		window.addEventListener('contextmenu', onRightClick, false);

		function onMouseMove(event) {
			// 화면 중앙을 기준으로 마우스 위치 정규화
			const mouseZ = (event.clientX / window.innerWidth) * 2 - 1;
			const mouseY = 0.5 -(event.clientY / window.innerHeight) * 2 + 1;

			// 카메라 위치 조정 (마우스 위치에 따라)
			camera.position.z = -mouseZ * 2; // 조정 범위와 값은 필요에 따라 변경
			camera.position.y = mouseY * 2;

			// 카메라가 바라보는 방향 조정 (마우스 위치에 따라)
			camera.lookAt(0, 0.5, 0);
	//		console.log(camera.position.z, camera.position.y)
		}
		window.addEventListener('mousemove', onMouseMove, false);

		// 화면 크기가 변경될 때 Three.js 렌더러를 다시 계산하여 렌더링
		const onWindowResize = () => {
			const newWidth = window.innerWidth;
			const newHeight = window.innerHeight;

			renderer.setSize(newWidth, newHeight);
			camera.aspect = newWidth / newHeight;
			camera.updateProjectionMatrix();
		};
		window.addEventListener('resize', onWindowResize);

		const animate = () => {
			requestAnimationFrame(animate);
			const delta = clock.getDelta();
			if (mixerRef.current)
				mixerRef.current.update(delta);
			renderer.render(scene, camera);
		};
		animate();

		return () => {
			window.removeEventListener('resize', onWindowResize);
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mousedown', onMouseClick);
			window.removeEventListener('contextmenu', onRightClick);
			currentMount.removeChild(renderer.domElement);
			renderer.dispose();
			// 여기에 추가적인 정리 코드
		};
	}, []);

	// if (isLoading) return <div>Loading...</div>;

	return (
			<div ref={mountRef}>
				{isLoading && (
						<div style={{
							position: 'fixed', // 화면에 고정
							top: '50%', // 상단에서 50% 위치
							left: '50%', // 왼쪽에서 50% 위치
							transform: 'translate(-50%, -50%)', // 정중앙 정렬
							width: 'fit-content', // 내용에 맞게 폭 조정
						}}>
							<LinearProgressWithLabel
									value={loadingProgress}
									// 필요한 경우 추가 스타일링
							/>
						</div>
				)}
			</div>
	);
}

export default GLBLoaderComponent;