import React from 'react';
import { Modal, Box, IconButton, useTheme } from '@mui/material';
import ModifyFridge from './ModifyFridge';
import ModifyFridgeInside from './ModifyFridgeInside';
import ShowFridge from './ShowFridge';
import ShowFridgeInside from './ShowFridgeInside';
import CloseIcon from '@mui/icons-material/Close';

function FridgeModal({userId, open, handleClose}) {
	const [openInside, setOpenInside] = React.useState(false);
	const theme = useTheme();

	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-title"
			aria-describedby="modal-description"
		>
			<Box
				sx={{
					position: 'fixed',
					top: 0,
					left: 0,
					width: '100vw',
					height: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: 1300, // zIndex는 필요에 따라 조정
				}}
			>
				{userId ?
					(openInside ? <ShowFridgeInside setOpenInside={setOpenInside} userId={userId}/> : <ShowFridge setOpenInside={setOpenInside} userId={userId}/>) :
					(openInside ? <ModifyFridgeInside setOpenInside={setOpenInside}/> : <ModifyFridge setOpenInside={setOpenInside}/>)
				}
				{/*{openInside ? <ModifyFridgeInside setOpenInside={setOpenInside}/> : <ModifyFridge setOpenInside={setOpenInside}/>}*/}
				<IconButton onClick={handleClose} sx={{position: 'absolute', top: '10px', right: '10px', color: theme.palette.primary.main}}>
					<CloseIcon fontSize="large"/>
				</IconButton>
			</Box>
		</Modal>
	);
}

export default FridgeModal;
