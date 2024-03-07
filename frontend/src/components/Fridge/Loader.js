import React, { useEffect } from 'react';
import { useProgress, Html } from '@react-three/drei';
import { LinearProgress, Typography, Box } from '@mui/material';

function Loader({ setIsLoading }) {
	const { progress, active } = useProgress();
	const normalizedProgress = Math.round(progress); // 소수점 제거

	useEffect(() => {
		console.log('Loader active: ', active);
		if (setIsLoading)
			setIsLoading(active);
	}, [active, setIsLoading]);
	return (
		<Html center>
			<Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" style={{ width: '200px', color: '#fff' }}> {/* 스타일을 원하는 대로 조정하세요 */}
				<Typography variant="h6" color="textSecondary">{`${normalizedProgress}%`}</Typography>
				<Box width="100%" mr={1}>
					<LinearProgress variant="determinate" value={normalizedProgress} />
				</Box>
			</Box>
		</Html>
	);
}

export default Loader;
