import React, {useEffect, useState} from 'react';
import {List, ListItem, ListItemText, CircularProgress, Avatar, Divider, IconButton} from '@mui/material';
import {useSelector} from "react-redux";
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import {useWebSocket} from "../context/WebSocketContext"; // 채팅 아이콘 추가

const FollowList = ({setTabValue, setExpandedRoomId}) => {
    const [followees, setFollowees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const curUser = useSelector(state => state.auth.user);
    const navigate = useNavigate();

    const {sendMessage, roomStatus, setRoomStatus, subscribe} = useWebSocket();

    const getAuthHeader = () => {
        const authHeader = localStorage.getItem('authHeader');
        return authHeader ? {Authorization: authHeader} : {};
    };

    const getChatRooms = () => {
        const chatRooms = sessionStorage.getItem('roomList');
        return chatRooms ? JSON.parse(chatRooms) : [];
    };

    useEffect(() => {
        const fetchFollowees = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/myFollowee`, {
                    headers: getAuthHeader(),
                });
                setFollowees(response.data.list);
            } catch (error) {
                console.error("Failed to fetch followers:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (curUser) {
            fetchFollowees();
        }
    }, [curUser]);

    const navigateToChatRoom = async (followee) => {
        // 현재 채팅방 목록 가져오기
        let roomList = getChatRooms();
        // 현재 사용자와 followee만 있는 방 찾기
        let room = roomList.find(r =>
            r.users.length === 2 &&
            r.users.some(user => user.nickname === curUser.nickname) &&
            r.users.some(user => user.nickname === followee.nickname)
        );

        // 해당 방이 이미 존재한다면 바로 그 방으로 이동
        if (room) {
            console.log(room.id);
            setExpandedRoomId(room.id); // 확장될 방 ID 설정
            setTabValue(1); // 채팅 탭으로 변경
        } else {
            // 새로운 방 생성
            try {
                axios.post(`${process.env.REACT_APP_API_URL}/chatroom/createRoom`, {otherUserEmail: followee.email}, {
                    headers: getAuthHeader(),
                }).then((response) => {
                    sendMessage(`/app/notification/${followee.nickname}`, JSON.stringify({roomId:response.data.id}));
                    // 새 방 정보 추가
                    const newRoom = response.data;
                    subscribe(`/topic/messages/${newRoom.id}`, (message) => {
                        console.log('Message received');
                        setRoomStatus(prevStatus =>
                            prevStatus?.map(r =>
                                r.id === newRoom.id ? {...newRoom, lastMessage: JSON.parse(message.body)} : r
                            )
                        );
                    });

                    setRoomStatus([...roomStatus, newRoom])

                    // roomList.push(newRoom);
                    // // sessionStorage에 저장
                    // sessionStorage.setItem('roomList', JSON.stringify(roomList));
                    // // 새 방으로 이동
                    setExpandedRoomId(newRoom.id); // 확장될 방 ID 설정
                    setTabValue(1); // 채팅 탭으로 변경
                });


            } catch (error) {
                console.error("Failed to create chatroom:", error);
            }
        }
    };

    const handleListItemClick = (id) => {
        navigate(`/user/${id}`);
    };

    if (isLoading) {
        return <CircularProgress/>;
    }

    return (
        <List>
            {followees?.map((followee) => (
                <React.Fragment key={followee.id}>
                    <ListItem
                        secondaryAction={
                            <IconButton edge="end" onClick={() => navigateToChatRoom(followee)}>
                                <ChatIcon/>
                            </IconButton>
                        }
                    >
                        <Avatar alt={followee.name}
                                src={followee?.profile ? `${followee.profile}` : 'default_profile_picture_url'}/>
                        <ListItemText primary={`${followee.nickname}`}
                                      onClick={() => handleListItemClick(followee.id)}/>
                    </ListItem>
                    <Divider/>
                </React.Fragment>
            ))}
        </List>
    );
};

export default FollowList;
