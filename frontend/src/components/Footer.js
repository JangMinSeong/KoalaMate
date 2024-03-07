import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const Footer = () => {
	return (
		<Box component="footer" sx={{ bgcolor: 'transparent', py: 6 }}>
			<Container maxWidth="lg">
				<Typography variant="body1" align="center" color="text.secondary">
					&copy; {new Date().getFullYear()} 코알라 메이트
				</Typography>
			</Container>
		</Box>
	);
};

export default Footer;
