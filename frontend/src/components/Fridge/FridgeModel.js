import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import FRIDGE_URL from 'assets/fridge.glb';

export default function FridgeModel({setUuid}) {
	const { scene } = useGLTF(FRIDGE_URL);

	useEffect(() => {
		setUuid(scene.uuid);
	//	console.log(scene);
		scene.traverse((obj) => {
			if (obj.isMesh) {
				// obj.castShadow = true;
				// obj.receiveShadow = true;
			}
		});
	}, [scene]);

	return <primitive object={scene}/>;
}