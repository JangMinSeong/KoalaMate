import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import FRIDGE_INSIDE_URL from 'assets/fridgeInside.glb';

export default function FridgeModel({setUuid}) {
	const { scene } = useGLTF(FRIDGE_INSIDE_URL);

	useEffect(() => {
		// setUuid(scene.uuid);
		scene.traverse((obj) => {
			if (obj.isMesh) {
				// obj.castShadow = true;
				// obj.receiveShadow = true;
				if (obj.material.transparent) {
					obj.renderOrder = 2;
				}
			}
		});
	}, [scene]);

	return <primitive object={scene}/>;
}