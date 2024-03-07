import React, { useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import I_URL from 'assets/I.glb';
import N_URL from 'assets/N.glb';
import F_URL from 'assets/F.glb';
import P_URL from 'assets/P.glb';
import E_URL from 'assets/E.glb';
import S_URL from 'assets/S.glb';
import T_URL from 'assets/T.glb';
import J_URL from 'assets/J.glb';
import Chicken_URL from 'assets/chicken.glb';
import Watermelon_URL from 'assets/watermelon.glb';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function MBTIModel ({ initialPosition, fridgeUuid, models, setModels, setIsSaved }) {
	const { camera, pointer, scene } = useThree();
	// const [models, setModels] = useState([]);
	const [draggedModel, setDraggedModel] = useState(null);

	const { scene: I_scene } = useGLTF(I_URL);
	const { scene: N_scene } = useGLTF(N_URL);
	const { scene: F_scene } = useGLTF(F_URL);
	const { scene: P_scene } = useGLTF(P_URL);
	const { scene: E_scene } = useGLTF(E_URL);
	const { scene: S_scene } = useGLTF(S_URL);
	const { scene: T_scene } = useGLTF(T_URL);
	const { scene: J_scene } = useGLTF(J_URL);
	const { scene: Chicken_scene } = useGLTF(Chicken_URL);
	const { scene: Watermelon_scene } = useGLTF(Watermelon_URL);

	const onModelClick = (modelScene, url) => {
		if (!modelScene) {
			return;
		}
		const existingModel = models.find(
			model => model.object.uuid === modelScene.uuid);
		if (existingModel) {
			setDraggedModel({ ...existingModel, isNew: false });
		} else {
			const clonedObject = modelScene.clone();
			setDraggedModel({
				object: clonedObject,
				url: url,
				position: [initialPosition.x, initialPosition.y, 1.4],
				isNew: true,
			});
			scene.add(clonedObject);
		}
	};

	useEffect(() => {
	}, [draggedModel])

	useFrame(() => {
		if (draggedModel) {
			document.body.style.cursor = 'grabbing';
			const normalizedPosition = new THREE.Vector3(pointer.x, pointer.y, 0.5);
			const worldPosition = normalizedPosition.unproject(camera);
			const dir = worldPosition.sub(camera.position).normalize();
			const distance = (1.4 - camera.position.z) / dir.z;
			const finalPosition = camera.position.clone()
				.add(dir.multiplyScalar(distance));

			draggedModel.object.position.set(finalPosition.x, finalPosition.y, 1.4);
			draggedModel.position = [finalPosition.x, finalPosition.y, 1.4]
		}
	});

	useEffect(() => {
		const handlePointerUp = () => {
			document.body.style.cursor = 'auto';
			if (!draggedModel) return;

			const raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(pointer, camera);

			const fridge = scene.getObjectByProperty('uuid', fridgeUuid);

			if (fridge) {
				const intersects = raycaster.intersectObject(fridge, true);
				if (intersects.length === 0) {
					if (!draggedModel.isNew) {
						setModels(models.filter(model => model.object.uuid !== draggedModel.object.uuid));
						setIsSaved(false);
					}
					scene.remove(draggedModel.object);
					setDraggedModel(null);
				} else {
					if (draggedModel.isNew) {
						setModels([
							...models,
							{...draggedModel},
						]);
						setIsSaved(false);
					} else {
						// 드래그가 완료되면 모델의 위치를 업데이트합니다.
						setModels(models.map(model =>
							model.object.uuid === draggedModel.object.uuid
								? { ...model}
								: model,
						));
						setIsSaved(false);
					}
					setDraggedModel(null);
				}
			}
		};
		window.addEventListener('pointerup', handlePointerUp);

		return () => {
			window.removeEventListener('pointerup', handlePointerUp);
		};
	}, [draggedModel, models]);

	useEffect(() => {
		scene.traverse((obj) => {
			if (obj.isMesh) {
				obj.castShadow = true;
				// obj.receiveShadow = true;
			}
		});
	}, [models]);

	return (
		<>
			<group position={initialPosition}>
				<primitive object={I_scene} position={[0, 0, 1.4]}
				           onPointerDown={() => onModelClick(I_scene, 'assets/I.glb')}
				           onPointerOver={() => (document.body.style.cursor = 'pointer')}
				           onPointerOut={() => (document.body.style.cursor = 'auto')}
				/>
				<primitive object={N_scene} position={[0, -1, 1.4]}
				           onPointerDown={() => onModelClick(N_scene, 'assets/N.glb')}
				           onPointerOver={() => (document.body.style.cursor = 'pointer')}
				           onPointerOut={() => (document.body.style.cursor = 'auto')}
				/>
				<primitive object={F_scene} position={[0, -2, 1.4]}
				           onPointerDown={() => onModelClick(F_scene, 'assets/F.glb')}
				           onPointerOver={() => (document.body.style.cursor = 'pointer')}
				           onPointerOut={() => (document.body.style.cursor = 'auto')}
				/>
				<primitive object={P_scene} position={[0, -3, 1.4]}
				           onPointerDown={() => onModelClick(P_scene, 'assets/P.glb')}
				           onPointerOver={() => (document.body.style.cursor = 'pointer')}
				           onPointerOut={() => (document.body.style.cursor = 'auto')}
				/>
				<primitive object={E_scene} position={[1, 0, 1.4]}
				           onPointerDown={() => onModelClick(E_scene, 'assets/E.glb')}
				           onPointerOver={() => (document.body.style.cursor = 'pointer')}
				           onPointerOut={() => (document.body.style.cursor = 'auto')}
				/>
				<primitive object={S_scene} position={[1, -1, 1.4]}
				           onPointerDown={() => onModelClick(S_scene, 'assets/S.glb')}
				           onPointerOver={() => (document.body.style.cursor = 'pointer')}
				           onPointerOut={() => (document.body.style.cursor = 'auto')}
				/>
				<primitive object={T_scene} position={[1, -2, 1.4]}
				           onPointerDown={() => onModelClick(T_scene, 'assets/T.glb')}
				           onPointerOver={() => (document.body.style.cursor = 'pointer')}
				           onPointerOut={() => (document.body.style.cursor = 'auto')}
				/>
				<primitive object={J_scene} position={[1, -3, 1.4]}
				           onPointerDown={() => onModelClick(J_scene, 'assets/J.glb')}
				           onPointerOver={() => (document.body.style.cursor = 'pointer')}
				           onPointerOut={() => (document.body.style.cursor = 'auto')}
				/>
				<primitive object={Chicken_scene} position={[2, 0, 1.4]}
				           onPointerDown={() => onModelClick(Chicken_scene, 'assets/chicken.glb')}
				           onPointerOver={() => (document.body.style.cursor = 'pointer')}
				           onPointerOut={() => (document.body.style.cursor = 'auto')}
				/>
				<primitive object={Watermelon_scene} position={[2, -1, 1.4]}
				           onPointerDown={() => onModelClick(Watermelon_scene, 'assets/watermelon.glb')}
				           onPointerOver={() => (document.body.style.cursor = 'pointer')}
				           onPointerOut={() => (document.body.style.cursor = 'auto')}
				/>
			</group>
			{models.map((model) => (
				<primitive object={model.object} key={model.object.uuid} position={model.position}
				           onPointerDown={() => onModelClick(model.object)}
				           onPointerOver={() => (document.body.style.cursor = 'pointer')}
				           onPointerOut={() => (document.body.style.cursor = 'auto')}
				/>
			))}
		</>
	);
}