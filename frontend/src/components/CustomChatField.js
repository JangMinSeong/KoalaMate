import React from 'react';
import TextField from '@mui/material/TextField';
import {styled} from '@mui/material/styles';

const CustomTextField = styled(TextField)(({ theme }) => ({
	'& .MuiOutlinedInput-root': {
		'& fieldset': {
			borderColor: 'transparent', // 테두리 색상을 투명하게 설정
		},
		'&:hover fieldset': {
			borderColor: 'transparent', // 호버 시 테두리 색상을 투명하게 설정
		},
		'&.Mui-focused fieldset': {
			borderColor: 'transparent', // 포커스 시 테두리 색상을 투명하게 설정
		},
	},
	'& .MuiOutlinedInput-input': {
		padding: '10px 10px',
	},
}));

const CustomChatField = ({ value, onChange, onKeyPress }) => {
	return (
		<CustomTextField
			variant="outlined"
			placeholder="메시지를 입력하세요"
			fullWidth
			value={value}
			onChange={onChange}
			onKeyPress={onKeyPress}
			autoComplete="off"
		/>
	);
};

export default CustomChatField;