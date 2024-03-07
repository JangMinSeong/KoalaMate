import React, {useEffect, useState} from 'react';
import Chatting from 'components/Chatting';
import {
	List,
	ListItem,
	ListItemText,
	Button,
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
import { useWebSocket } from 'context/WebSocketContext';

const Chattings = () => {

    const [activeCall, setActiveCall] = useState(null);
    const [expandedRoomId, setExpandedRoomId] = useState(null);
    const navigate = useNavigate();
    const {disconnectSession} = useVoiceSocket();
    const location = useLocation(); // 현재 위치 정보를 가져옵니다.

    const [scrollPosition, setScrollPosition] = useState(0);

	const [tabValue, setTabValue] = useState(1); // 탭 상태 추가

    const [invitePopupOpen, setInvitePopupOpen] = useState(null); // 초기값을 null로 설정

	const {roomStatus} = useWebSocket();

    useEffect(() => {
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

    useEffect(() => {
   //     console.log('roomStatus: ', roomStatus);
    }, [roomStatus]);

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

    const handleOpenInvitePopup = (roomId) => {
        // 팝업창을 열 때 해당 채팅방 ID로 설정
        setInvitePopupOpen(roomId);
    };

    // useEffect(() => {
    //     const updateRooms = () => {
    //         const chatRooms = getChatRooms(); // getChatRooms 함수는 sessionStorage에서 roomList를 가져오는 함수
    //         setRooms(chatRooms);
    //     };
    //
    //     updateRooms();
    //
    //     // sessionStorage의 'roomList' 변경 감지를 위한 이벤트 리스너 추가
    //     window.addEventListener('storage', (event) => {
    //         if (event.key === 'roomList') {
    //             updateRooms();
    //         }
    //     });
    //
    //     // 컴포넌트 언마운트 시 이벤트 리스너 제거
    //     return () => {
    //         window.removeEventListener('storage', updateRooms);
    //     };
    // }, []);


    return (
        <Box sx={{width: '100%'}}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
                <Tab label="팔로우"/>
                <Tab label="채팅"/>
            </Tabs>
            {tabValue === 0 && <FollowList setTabValue={setTabValue} setExpandedRoomId={setExpandedRoomId} />}
            {tabValue === 1 && (

                <List component="nav">
                    {roomStatus.map((room) => (
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
                            {expandedRoomId === room.id && <Chatting roomNumber={room.id} users={room.users} lastMessage={room.lastMessage}/>}

                            {invitePopupOpen === room.id && (
                                <InvitePopup
                                    open={Boolean(invitePopupOpen)} // open 속성을 Boolean으로 변환하여 팝업의 열림/닫힘 상태 결정
                                    onClose={() => setInvitePopupOpen(null)} // 팝업을 닫을 때 invitePopupOpen을 null로 설정하여 모든 팝업 닫기
                                    users={room.users}
                                    roomId = {room.id}
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
