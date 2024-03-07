import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Chip, Divider, List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Badge  } from '@mui/material';
import { Favorite as FavoriteIcon } from '@mui/icons-material';
import DefaultImg from 'assets/profile.jpg';
import { useNavigate } from 'react-router-dom';
import {useSelector} from "react-redux";
import RefrigeratorImg from 'assets/refrig_map.png';

import { useMap } from 'context/MapContext';

const authHeader = localStorage.getItem('authHeader');

const RefrigList = ({markersData}) => {
    const [userData, setUserData] = useState([]);
    const navigate = useNavigate();
    const curUser = useSelector(state => state.auth.user);

    const { visibleMarkersData } = useMap();

    // 좌우로 회전하는 이미지 스타일
    const swingStyle = {
        animation: 'swing ease-in-out 0.3s infinite alternate',
        transformOrigin: 'top center'
    };

    // CSS 애니메이션
    useEffect(() => {
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = `
            @keyframes swing {
                from { transform: rotate(-5deg); }
                to { transform: rotate(5deg); }
            }
        `;
        document.head.appendChild(styleSheet);
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);


    const getUserData = async () => {
        if (!authHeader) {
            console.error('Authorization token is missing');
            return;
        }

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/findmate/listMate`, {
                headers: {
                    'Authorization': authHeader
                }
            });
            const filteredData = response.data.filter(user => user.nickname !== curUser.nickname && user.nickname !== 'admin');
     //       console.log(filteredData);
            setUserData(filteredData);
        } catch (error) {
            console.error('유저 리스트를 가져오는 중 에러 발생: ', error);
        }
    };

    useEffect(() => {
        //getUserData();
    }, []);

    // 리스트 아이템 클릭 핸들러, id를 인자로 받음
    const handleListItemClick = (id) => {
        navigate(`/user/${id}`);
    };

    return (
        <Box sx={{ alignItems: 'flex-start' }}>
            <h3>내 주변의 냉장고</h3>
            <Divider />
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {visibleMarkersData.map((user) => (
                    <React.Fragment key={user.id}>
                        <Box onClick={() => handleListItemClick(user.id)} sx={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginY: 1 }}>
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar src={user.profile ? `${user.profile}` : DefaultImg} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.nickname}
                                    secondary={
                                        <Box display="flex" gap={1}>
                                            <Chip label={user.gender} sx={{
                                                bgcolor: (user.gender === '여자' || user.gender === '여성') ? '#F8BBD0' : '#BBDEFB',
                                            }} />
                                            <Chip label={`${user.birthRange}대`} sx={{ bgcolor: '#CDFAD5' }} />
                                        </Box>
                                    }
                                />
                            </ListItem>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginRight: 2 }}>
                                {user.follow ? (
                                    <Badge badgeContent={<FavoriteIcon color="error" sx={{ fontSize: 'small' }}/>} overlap="circular">
                                        <Avatar src={RefrigeratorImg} style={user.likeCnt > 2 ? swingStyle : {}}/>
                                    </Badge>
                                ) : (
                                    <Avatar src={RefrigeratorImg} style={user.likeCnt > 2 ? swingStyle : {}}/>
                                )}
                            </Box>
                        </Box>
                        <Divider />
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
};

export default RefrigList;
