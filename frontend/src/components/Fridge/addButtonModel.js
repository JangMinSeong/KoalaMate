import React from 'react';
import ADD_BUTTON_URL from 'assets/addButton.glb';
import {useGLTF} from "@react-three/drei";

export default function AddButtonModel({ models, onAddClick }) {
    const {scene: addButtonScene} = useGLTF(ADD_BUTTON_URL);

    return (
        <primitive object={addButtonScene} position={[(models.length % 4) * 0.45 - 0.7, Math.floor(models.length / 4) * -0.85 + 1.3, -0.5]} scale={[0.1, 0.1, 0.1]} onClick={onAddClick}
                   onPointerOver={() => (document.body.style.cursor = 'pointer')}
                   onPointerOut={() => (document.body.style.cursor = 'auto')}
        />
    );
}