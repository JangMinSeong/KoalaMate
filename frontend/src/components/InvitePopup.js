import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { CircularProgress, Typography } from "@mui/material";
import {useWebSocket} from "../context/WebSocketContext";

const InvitePopup = ({ open, onClose, users, roomId }) => {
    const [followees, setFollowees] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const curUser = useSelector(state => state.auth.user);

    const { sendMessage, roomStatus, setRoomStatus } = useWebSocket();


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

    const getAuthHeader = () => {
        const authHeader = localStorage.getItem('authHeader');
        return authHeader ? { Authorization: authHeader } : {};
    };

    const filteredFollowees = followees.filter(followee => !users.some(user => user.nickname === followee.nickname));

    const handleInvite = async (user) => {
        try {

            axios.post(`${process.env.REACT_APP_API_URL}/chatroom/invite`, {
                userEmail: user.email,
                chatroomId: roomId
            }, {
                headers: getAuthHeader(),
            }).then( (response) => {
                sendMessage(`/app/notification/${user.nickname}`,JSON.stringify({roomId:response.data.id}))
            });

            const roomIndex = roomStatus.findIndex(room => room.id === roomId);
            if (roomIndex !== -1) {
                roomStatus[roomIndex].users.push(user);
            }

            onClose();
        } catch (error) {
            console.error("Failed to invite user:", error);
        }
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <Dialog onClose={onClose} open={open} sx={{ '& .MuiDialog-paper': { minWidth: '300px', borderRadius: '16px' } }}>
            <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>초대하기</DialogTitle>
            <List sx={{ pt: 0 }}>
                {filteredFollowees.length > 0 ? (
                    filteredFollowees.map((followee) => (
                        <ListItem button onClick={() => handleInvite(followee)} key={followee.id}>
                            <Avatar src={followee?.profile ? `${followee.profile}` : 'default_profile_picture_url'} />
                            <ListItemText primary={followee.nickname} sx={{ ml: 2 }} />
                        </ListItem>
                    ))
                ) : (
                    <ListItem>
                        <ListItemText primary={<Typography style={{ textAlign: 'center' }}>초대할 유저가 없습니다.</Typography>} />
                    </ListItem>
                )}
            </List>
        </Dialog>
    );
};

export default InvitePopup;
