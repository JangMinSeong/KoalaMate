// DrinkingAmountInput.js
import React from 'react';
import { Box, Typography, TextField } from '@mui/material';
import Soju from 'assets/alcohol.png'
import SojuCup from 'assets/cup2.png';

const DrinkingAmountInput = ({
                                 sojuBottleCount,
                                 sojuCupCount,
                                 setSojuBottleCount,
                                 setSojuCupCount,
                             }) => {
    return (
        <Box margin="20px 0px 5px 0px" sx={{ display: 'flex', flexDirection:'column', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
            <Typography
                sx={{ fontWeight: 'bold' }}
                variant="h6"
            >
                주량 입력하기
            </Typography>
            <Typography fontSize="12px" sx={{ marginTop: 1, color: 'gray' }}>:</Typography>
            <Typography fontSize="12px" sx={{ marginTop: 1, color: 'gray' }}>주량 작성 ex)</Typography>
            <Typography fontSize="12px" sx={{ marginTop: 1, color: 'gray' }}>소주 2병 3잔, </Typography>
            <Typography fontSize="12px" sx={{ marginTop: 1, color: 'gray' }}>소주 0병 1잔</Typography>
            </Box>
            <Box>
                <img
                    src={Soju}
                    width="30"
                />
                <TextField
                    sx={{ marginTop: 4, marginX: 3 }}
                    type="number"
                    label="소주 병 수"
                    value={sojuBottleCount}
                    onChange={(e) => setSojuBottleCount(Number(e.target.value))}
                />
            </Box>

            <Box>
                <img
                    src={SojuCup}
                    width="30"
                />
                <TextField
                    sx={{ marginTop: 4, marginX: 3 }}
                    type="number"
                    label="소주 잔 수"
                    value={sojuCupCount}
                    onChange={(e) => setSojuCupCount(Number(e.target.value))}
                />
            </Box>
        </Box>
    );
};

export default DrinkingAmountInput;
