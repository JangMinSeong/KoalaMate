import React, { useEffect, useState } from 'react';
import Chatting from 'components/Chatting';
import {
	List,
	ListItem,
	ListItemText,
	Divider,
	IconButton,
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PhoneIcon from '@mui/icons-material/Phone';
import CallEndIcon from '@mui/icons-material/CallEnd';

import { useVoiceSocket } from 'context/VoiceSocketContext';

const getChatRooms = () => {
	const chatRooms = sessionStorage.getItem('roomList');
	return chatRooms ? JSON.parse(chatRooms) : [];
};

const Chattings = () => {
	const [rooms, setRooms] = useState([]);
	const [activeCall, setActiveCall] = useState(null);
	const [expandedRoomId, setExpandedRoomId] = useState(null);
	const navigate = useNavigate();
	const { disconnectSession } = useVoiceSocket();

	useEffect(() => {
		const chatRooms = getChatRooms();
		setRooms(chatRooms);
		// sessionStorage에서 activeCall 상태 복원
		const storedActiveCall = sessionStorage.getItem('activeCall');
		if (storedActiveCall) {
			setActiveCall(JSON.parse(storedActiveCall));
		}
	}, []);

	useEffect(() => {
		// activeCall 상태 변경 시 sessionStorage에 저장
		sessionStorage.setItem('activeCall', JSON.stringify(activeCall));
	}, [activeCall]);

	const toggleExpand = (roomId) => {
		setExpandedRoomId(expandedRoomId === roomId ? null : roomId);
	};

	const voiceCall = (roomId, users) => {
		setActiveCall(roomId);
		disconnectSession();
		navigate(`/voiceChat/${roomId}`, { state: { users } });
	};

	const disconnectCall = () => {
		setActiveCall(null);
		disconnectSession();
	};

	return (
		<List component="nav">
			{rooms.map((room) => (
				<React.Fragment key={room.id}>
					<ListItem button onClick={() => toggleExpand(room.id)}>
						<ListItemText
							primary={room.users.map(user => user.nickname).join(', ')}
							secondary={expandedRoomId !== room.id ? room.lastMessage && `${room.lastMessage.nickname}: ${room.lastMessage.content}` : ''}
						/>
						{expandedRoomId === room.id ? <ExpandLess /> : <ExpandMore />}
					</ListItem>
					<div>
						<IconButton color="primary" onClick={() => voiceCall(room.id, room.users)} disabled={activeCall === room.id}>
							<PhoneIcon />
						</IconButton>
						<IconButton color="secondary" onClick={() => disconnectCall()} disabled={activeCall !== room.id}>
							<CallEndIcon />
						</IconButton>
					</div>
					{expandedRoomId === room.id && <Chatting roomNumber={room.id} users={room.users}/>}
					<Divider />
				</React.Fragment>
			))}
		</List>
	);
};

export default Chattings;
