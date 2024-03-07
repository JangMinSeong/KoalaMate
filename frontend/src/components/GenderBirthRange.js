import {Chip, Box} from "@mui/material";
import React from "react";

const GenderBirthRange = ({gender, birthRange}) => {
    return (
        <>
            <Box display="flex" gap={1}>
                <Chip label={`${gender}`} sx={{
                    bgcolor: gender === '여자' ? '#F8BBD0' : '#BBDEFB', // 여성일 때 핑크, 남성일 때 파란색
                }}
                />
                <Chip label={`${birthRange}대`} sx={{ bgcolor: '#CDFAD5' }} />
            </Box>
        </>
    )
}
export default GenderBirthRange