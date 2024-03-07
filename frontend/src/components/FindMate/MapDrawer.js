import React, { useState } from 'react';
import { Drawer, Box, List, ListItem, ListItemText, IconButton } from '@mui/material';
import refrig from 'assets/refrig_map.png';
import Map from 'components/FindMate/Map';
import RefrigList from "components/FindMate/RefrigList";

export default function SlideIn() {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDrawer = () => {
		setIsOpen(!isOpen);
	};

	return (
		<Box
			sx={{
				flexGrow: 1,
				transition: 'margin 0.5s ease-out',
				marginLeft: isOpen ? '300px' : 0,
			}}
		>
			<IconButton onClick={toggleDrawer} size="large">
				<img src={refrig} alt="Open" style={{ maxWidth: '40px', maxHeight: '40px' }} />
			</IconButton>
			<Drawer
				anchor="left"
				open={isOpen}
				onClose={toggleDrawer}
				variant="persistent"
				sx={{
					'& .MuiDrawer-paper': {
						bgcolor: 'white',
						// marginTop: '70px', // 네비게이션 바의 높이만큼 상단 마진 설정
						// height: `calc(100% - 100px)`,// 전체 높이에서 네비게이션 바의 높이를 뺀 높이 설정
					},
				}}
			>
				{/* Drawer 내부 아이템 리스트 */}
				<Box
					sx={{
						width: 300,
						marginX: '20px',
					}}
					role="presentation"
					onClick={toggleDrawer} // 이 부분은 실제로 필요하지 않을 수 있으니, Drawer 내용에 따라 조정
					onKeyDown={toggleDrawer} // 동일하게, 실제 필요에 따라 조정
				>
					<List>
						{/*{['Item 1', 'Item 2', 'Item 3', 'Item 4'].map((text) => (*/}
						{/*	<ListItem button key={text}>*/}
						{/*		<ListItemText primary={text} />*/}
						{/*	</ListItem>*/}
						{/*))}*/}
						<RefrigList/>
					</List>
				</Box>
			</Drawer>
			<Box>
				{/*<Map />*/}
			</Box>
		</Box>
	);
}
