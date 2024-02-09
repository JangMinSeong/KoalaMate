import React, {useEffect, useState} from 'react';
import Chatting from 'components/Chatting';
import {
    List,
    ListItem,
    ListItemText,
    Divider,
    IconButton,
	Tabs,
	Tab,
	Box
} from '@mui/material';
import {useNavigate, useLocation} from "react-router-dom";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PhoneIcon from '@mui/icons-material/Phone';
import CallEndIcon from '@mui/icons-material/CallEnd';
import Badge from '@mui/material/Badge';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ChatIcon from '@mui/icons-material/Chat'; // 채팅 아이콘 추가
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import FollowList from 'components/FollowList';
import InvitePopup from 'components/InvitePopup';

import {useVoiceSocket} from 'context/VoiceSocketContext';

const getChatRooms = () => {
    const chatRooms = sessionStorage.getItem('roomList');
    return chatRooms ? JSON.parse(chatRooms) : [];
};

const Chattings = () => {

    const [rooms, setRooms] = useState([]);
    const [activeCall, setActiveCall] = useState(null);
    const [expandedRoomId, setExpandedRoomId] = useState(null);
    const navigate = useNavigate();
    const {disconnectSession} = useVoiceSocket();
    const location = useLocation(); // 현재 위치 정보를 가져옵니다.

    const [scrollPosition, setScrollPosition] = useState(0);

	const [tabValue, setTabValue] = useState(1); // 탭 상태 추가

    const [invitePopupOpen, setInvitePopupOpen] = useState(false);
    const [invitableUsers, setInvitableUsers] = useState([]);


    useEffect(() => {
        const chatRooms = getChatRooms();
        setRooms(chatRooms);
        // sessionStorage에서 activeCall 상태 복원
        const storedActiveCall = sessionStorage.getItem('activeCall');
        if (storedActiveCall) {
            setActiveCall(JSON.parse(storedActiveCall));
        }
    }, [expandedRoomId]);

    useEffect(() => {
        // activeCall 상태 변경 시 sessionStorage에 저장
        sessionStorage.setItem('activeCall', JSON.stringify(activeCall));
    }, [activeCall]);

    useEffect(() => {
        window.scrollTo(0, scrollPosition); // 스크롤 위치를 이전 위치로 설정
    }, [expandedRoomId]);

	// 탭 변경 핸들러
	const handleTabChange = (event, newValue) => {
		setTabValue(newValue);
	};

    const toggleExpand = (roomId, room) => {
        room.confirmMessageId = room.lastMessage?.id;
        setExpandedRoomId(expandedRoomId === roomId ? null : roomId);
    };

    const enterRoom = (roomId, users) => {
        navigate(`/voiceChat/${roomId}`, {state: {users, shouldConnectSession: false}});
    }

    const voiceCall = (roomId, users) => {
        setActiveCall(roomId);
        disconnectSession();
        navigate(`/voiceChat/${roomId}`, {state: {users}});
    };

    const disconnectCall = () => {
        setActiveCall(null);
        disconnectSession();

        if (/^\/voiceChat\/\d+$/.test(location.pathname)) {
            navigate('/'); // 조건이 충족되면 홈 화면으로 이동합니다.
        }
    };

    const getAuthHeader = () => {
        const authHeader = localStorage.getItem('authHeader');
        return authHeader ? { Authorization: authHeader } : {};
    };

    const handleOpenInvitePopup = (roomId) => {
        // 팝업창 열기
        setInvitePopupOpen(true);

        // 여기서 follow하는 유저 중 현재 채팅방에 없는 유저들의 목록을 가져오는 로직을 구현
        // 예시 코드는 이 부분을 구체적으로 구현한 것이 아니므로, 실제 API 호출 등을 통해 목록을 구해야 함
        // setInvitableUsers([...]);
    };

    return (
        <Box sx={{width: '100%'}}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
                <Tab label="팔로우"/>
                <Tab label="채팅"/>
            </Tabs>
            {tabValue === 0 && <FollowList setTabValue={setTabValue} setExpandedRoomId={setExpandedRoomId} />}
            {tabValue === 1 && (

                <List component="nav">
                    {rooms.map((room) => (
                        <React.Fragment key={room.id}>
                            <ListItem button onClick={() => toggleExpand(room.id, room)}>
                                <ListItemText
                                    primary={room.users.map(user => user.nickname).join(', ')}
                                    secondary={expandedRoomId !== room.id ? room.lastMessage && `${room.lastMessage.nickname}: ${room.lastMessage.content}` : ''}
                                />
                                {expandedRoomId === room.id ? <ExpandLess/> : <ExpandMore/>}
                            </ListItem>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <IconButton color="primary" onClick={() => voiceCall(room.id, room.users)}
                                            disabled={activeCall === room.id}>
                                    <PhoneIcon/>
                                </IconButton>
                                <IconButton color="secondary" onClick={() => disconnectCall()}
                                            disabled={activeCall !== room.id}>
                                    <CallEndIcon/>
                                </IconButton>

                                {activeCall === room.id && (
                                    <IconButton color="primary" onClick={() => enterRoom(room.id, room.users)}>
                                        <MeetingRoomIcon/>
                                    </IconButton>
                                )}

                                {/* Badge를 오른쪽으로 정렬하기 위한 컨테이너 */}
                                <div style={{marginLeft: 'auto', marginRight: '20px'}}>
                                    <IconButton onClick={() => handleOpenInvitePopup(room.id)}>
                                        <PersonAddIcon/>
                                    </IconButton>
                                    <Badge color="secondary" variant="dot"
                                           invisible={room.lastMessage?.id === room.confirmMessageId}>
                                        <ChatIcon
                                            color={room.lastMessage?.id === room.confirmMessageId ? "disabled" : "action"}/>
                                    </Badge>
                                </div>
                            </div>
                            {expandedRoomId === room.id && <Chatting roomNumber={room.id} users={room.users}/>}

                            {invitePopupOpen && (
                                <InvitePopup
                                    open={invitePopupOpen}
                                    onClose={() => setInvitePopupOpen(false)}
                                    users={invitableUsers}
                                    onInvite={(user) => console.log("초대하기:", user)} // 실제 초대 로직 구현 필요
                                />
                            )}

                            <Divider/>
                        </React.Fragment>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default Chattings;
