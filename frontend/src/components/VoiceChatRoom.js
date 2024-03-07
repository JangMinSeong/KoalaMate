import React, { useEffect } from 'react';
import { useVoiceSocket } from 'context/VoiceSocketContext';
import axios from 'axios';
import {useParams, useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import { Paper, Avatar, Grid, Typography } from "@mui/material";
import Box from '@mui/material/Box';

import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom'; // useNavigate import





const BACKEND_URL = process.env.REACT_APP_VOICE_URL;

const VoiceChatRoom = () => {
    const { roomId } = useParams();
    const location = useLocation();
    // location 객체에서 state 속성을 통해 전달된 데이터를 읽음
    const { users } = location.state;
    const { connectToSession, disconnectSession, participants, setParticipants, publisher, toggleMicrophone, isMicrophoneEnabled } = useVoiceSocket();
    const navigate = useNavigate(); // useNavigate 훅 사용

    // ... useEffect 등 기존 로직
    const curUser = useSelector(state => state.auth.user);

    useEffect(() => {
        const shouldConnectSession = location.state?.shouldConnectSession;

        if (shouldConnectSession === false) {
      //      console.log("세션 연결 생략");
            return; // 세션 연결을 건너뛰고 useEffect 종료
        }

     //   console.log(curUser);
     //   console.log(users);
        (async () => {
            try {
                // 세션 생성
                const sessionIdResponse = await axios.post(`${BACKEND_URL}/sessions`, {customSessionId: roomId });
                const sessionId = sessionIdResponse.data;
                const tokenResponse = await axios.post(`${BACKEND_URL}/sessions/${sessionId}/connections`, {customNickname: curUser.nickname});
                //console.log(tokenResponse);
                const token = tokenResponse.data;
                //console.log(token);
                //console.log(users);
                connectToSession(token);

                //setParticipants(users);
            } catch (error) {
                console.error('Error setting up voice chat:', error);
            }
        })();
        //return () => disconnectSession(); // Cleanup on component unmount
    }, [roomId, location.state]);

    const handleAvatarClick = (userId) => {
        navigate(`/user/${userId}`); // 프로그래매틱 네비게이션
    };


    return (
        <div>
            <h2>Voice Chat Room</h2>
            <Paper elevation={3} style={{ width: '80%', margin: 'auto', height: 500, position: 'relative', overflowY: 'scroll' }}>
                <Grid container spacing={2} justifyContent="center" style={{ padding: 20 }}>
                    {users.map(user => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={user.nickname} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar
                                onClick={() => user?.id ? handleAvatarClick(user.id) : null}
                                src={user?.profile ? `${user.profile}` : 'default_profile_picture_url'} sx={{ width: 100, height: 100, border: `2px solid ${participants.some(p => p.nickname === user.nickname) || user.nickname === curUser.nickname ? 'blue' : 'grey'}` }} />
                            <Typography variant="subtitle1" style={{ marginTop: '10px' }}>
                                {user.nickname}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
            <Box display="flex" justifyContent="center" marginTop={2}>
                <IconButton
                    onClick={toggleMicrophone}
                    color="primary"
                    aria-label="toggle microphone"
                    sx={{ width: 56, height: 56, "& .MuiSvgIcon-root": { fontSize: 40 } }} // 버튼과 아이콘 크기 조정
                >
                    {isMicrophoneEnabled ? <MicIcon /> : <MicOffIcon />}
                </IconButton>
            </Box>
        </div>
    );
};

export default VoiceChatRoom;