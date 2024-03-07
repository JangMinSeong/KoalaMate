// IntroductionInput.js
import React from 'react';
import { TextField } from '@mui/material';

const IntroductionInput = ({ introduction, setIntroduction }) => {
    return (
        <TextField
            sx={{ marginTop: 2, width: 600 }}
            type="string"
            label="TMI"
            placeholder="한 줄 소개를 작성해주세요"
            value={introduction}
            onChange={(e) => setIntroduction(e.target.value)}
        />
    );
};

export default IntroductionInput;
