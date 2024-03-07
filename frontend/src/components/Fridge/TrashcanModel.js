import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import TRASHCAN_URL from 'assets/trashcan.glb';

export default function TrashcanModel({ initialPosition, setModels, models, setIsSaved }) {
	const { scene, animations } = useGLTF(TRASHCAN_URL);
	const mixerRef = useRef(new THREE.AnimationMixer(scene));
	const [openAction, setOpenAction] = useState(null);
	const [closeAction, setCloseAction] = useState(null);
	const totalDuration = 1; // 애니메이션의 총 길이를 초 단위로 설정

	useEffect(() => {
		animations.forEach((clip) => {
			const action = mixerRef.current.clipAction(clip);
			action.clampWhenFinished = true; // 애니메이션이 끝나면 마지막 프레임에 고정합니다.
			action.loop = THREE.LoopOnce; // 애니메이션을 한 번만 재생합니다.
			if (clip.name === "open") {
				setOpenAction(action);
			}
		});
	}, [animations]);

	useFrame((state, delta) => {
		mixerRef.current.update(delta);
	});

	const handlePointerOver = () => {
		document.body.style.cursor = "pointer";
		openAction.setEffectiveTimeScale(3);
		openAction.play();
	};

	const handlePointerOut = () => {
		document.body.style.cursor = "auto";
		openAction.stop();
	};

	const handlePointerDown = () => {
		if (models.length > 0) {
			setIsSaved(false);
		}
		setModels([]);
	};

	return <primitive object={scene} position={initialPosition} scale={[0.4, 0.4, 0.4]} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut} onPointerDown={handlePointerDown}/>;
}
