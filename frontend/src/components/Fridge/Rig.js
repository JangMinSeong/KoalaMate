import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

export default function Rig() {
	const { camera, pointer } = useThree();
	const vec = new Vector3();

	return useFrame(() => {
		camera.position.lerp(vec.set(pointer.x * 2, pointer.y * 2, camera.position.z), 0.025);
		camera.lookAt(0, 0, 0);
	});
}