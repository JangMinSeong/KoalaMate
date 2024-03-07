import React from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { styled } from '@mui/material/styles';

const StyledTextareaAutosize = styled(TextareaAutosize)(({ theme }) => ({
	fontFamily: 'Noto Sans KR',
	width: '100%',
	height: '400px',
	padding: theme.spacing(2),
	borderRadius: theme.shape.borderRadius,
	borderColor: theme.palette.grey[300],
	outline: 'none',
	boxShadow: `0px 2px 6px ${theme.palette.grey[200]}`,
	boxSizing: 'border-box',
	'&:focus': {
		boxShadow: `0px 2px 6px ${theme.palette.primary.main}`,
	},
}));

function CustomTextareaAutosize(props) {
	return <StyledTextareaAutosize {...props} />;
}

export default CustomTextareaAutosize;
