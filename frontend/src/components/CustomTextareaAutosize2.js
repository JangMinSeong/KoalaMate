import React from 'react';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { styled } from '@mui/material/styles';

const StyledTextareaAutosize2 = styled(TextareaAutosize)(({ theme }) => ({
    fontFamily: 'Noto Sans KR',
    width: '95%',
    height: '400px',
    padding: theme.spacing(2),
    borderRadius: '15px',
    borderColor: theme.palette.grey[300],
    outline: 'none',
    boxShadow: `0px 2px 6px ${theme.palette.grey[200]}`,
    boxSizing: 'border-box',
    '&:focus': {
        boxShadow: `0px 2px 6px ${theme.palette.primary.main}`,
    },
}));

function CustomTextareaAutosize2(props) {
    return <StyledTextareaAutosize2 {...props} />;
}

export default CustomTextareaAutosize2;
