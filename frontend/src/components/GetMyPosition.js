import {Box, Button, Typography} from "@mui/material";
import React, {useState} from "react";

const GetMyPosition = ({setLatitude, setLongitude }) => {
    const [message, setMessage] = useState('');
    const getCurrentPosition = () => {
        navigator.geolocation.getCurrentPosition(
            position => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setMessage('현재 위치 등록 완료');
            },
            error => {
                console.error('위치 정보를 가져오는 중 오류 발생', error);
            }
        );
    };
    return (
        <Box>
            <Button variant="contained" onClick={getCurrentPosition}>현재 위치 등록</Button>
            {message && (
                <Typography variant="body2" color="textSecondary" mt={1} sx={{color: 'green'}}>
                    {message}
                </Typography>
            )}
        </Box>
    )
}

export default GetMyPosition