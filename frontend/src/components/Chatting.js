import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from 'context/WebSocketContext';
import {
	Box,
	TextField,
	Button,
	Typography,
	Grid,
	IconButton,
} from '@mui/material';
import { useSelector } from 'react-redux';
import CustomChatField from './CustomChatField';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Avatar from '@mui/material/Avatar';
import { useNavigate } from 'react-router-dom'; // useNavigate import

const Chatting = ({ roomNumber, users, lastMessage }) => {
	const { sendMessage, subscribe, roomStatus } = useWebSocket();
	const [messages, setMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState('');
	const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
	// 메시지를 수신할 대상 주소
	const messageDestination = `/topic/messages/${roomNumber}`;
	// 메시지를 전송할 대상 주소
	const sendDestination = `/app/messages/${roomNumber}`;
	const messagesEndRef = useRef(null);
	const [scrollY, setScrollY] = useState(0);
	const navigate = useNavigate(); // useNavigate 훅 사용


	const chatBoxRef = useRef(null); // chatBox를 위한 ref


	const handleBottomDetect = (e) => {
		setScrollY(
			e.target.scrollTop - (e.target.scrollHeight - e.target.clientHeight));
	};

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block:'center' });
	};

	const scrollToBottomDirect = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block:'center' });
	};

	const user = useSelector(state => state.auth.user);

	const getChatRooms = () => {
		const chatRooms = sessionStorage.getItem('roomList');
		return chatRooms ? JSON.parse(chatRooms) : [];
	};


	useEffect(() => {
//		console.log('lastMessage: ', lastMessage);
		if (lastMessage) {
//			console.log('lastMessage: ', lastMessage);
			setMessages((prevMessages) => [...prevMessages, lastMessage]);
				if (lastMessage.nickname === user.nickname) {
	//				console.log('my message')
					setTimeout(scrollToBottom, 100);
				}
		}
	}, [lastMessage]);

	useEffect(() => {
		// const watch = () => {
		// 	//window.addEventListener('scroll', handleBottomDetect);
		// };
		// watch();
		axios.post(`${process.env.REACT_APP_API_URL}/message/enter`, roomNumber, {
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((response) => {
	//			console.log('왜 여기 두 번 들어가냐');
	//			console.log(response);
				const reversedData = [...response.data].reverse(); // 배열 복사 후 역순으로 정렬
				reversedData.forEach((message) => {
					setMessages((prevMessages) => [...prevMessages, message]);
				});
			})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {
				setTimeout(scrollToBottomDirect, 10);
			});

		// 메시지 수신 구독
		// const subscription = subscribe(messageDestination, (message) => {
		// 	console.log('Message received');
		// 	const receivedMessage = JSON.parse(message.body);
		// 	setMessages((prevMessages) => [...prevMessages, receivedMessage]);
		// 	if (receivedMessage.nickname === user.nickname) {
		// 		console.log('my message')
		// 		setTimeout(scrollToBottom, 100);
		// 	}
		// 	const chatRoom = getChatRooms();
		// 	chatRoom.forEach((room) => {
		// 		if (room.id === roomNumber) {
		// 			room.lastMessage = receivedMessage;
		// 		}
		// 	});
		// 	sessionStorage.setItem('roomList', JSON.stringify(chatRoom));
		// 	setRoomStatus(chatRoom);
		//
		//
		// });
		// console.log(subscription);

		// 컴포넌트 언마운트 시 연결 해제
		return () => {
//			console.log('asdfasdf');
			// if (subscription) {
			// 	console.log('Unsubscribed from ' + messageDestination);
			// 	subscription.unsubscribe();
			// }
			window.removeEventListener('scroll', handleBottomDetect);
		};
	}, [messageDestination]);

	// 스크롤 이벤트 핸들러
	const handleScroll = (e) => {
		const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
		// 사용자가 스크롤을 최하단에서 벗어났는지 감지
		const threshold = 10; // 스크롤 위치가 하단에서 10px 이상 벗어났는지 여부
		setIsUserScrolledUp(scrollTop + clientHeight < scrollHeight - threshold);
	};

	useEffect(() => {
		const chatBox = document.getElementById('chatBox');
		chatBox.addEventListener('scroll', handleScroll);

		return () => {
			chatBox.removeEventListener('scroll', handleScroll);
		};
	}, []);

	useEffect(() => {
		// 메시지 수신 구독 로직...
		const subscription = subscribe(messageDestination, (message) => {
			// 메시지 수신 로직...
			if (!isUserScrolledUp || message.nickname === user.nickname) {
				setTimeout(scrollToBottom, 100);
			}
		});

		return () => {
			if (subscription) {
				subscription.unsubscribe();
			}
		};
	}, [isUserScrolledUp, messageDestination, user.nickname]);


	const handleSendMessage = () => {
		if (inputMessage.trim() !== '') {
			const messageToSend = JSON.stringify(
				{ content: inputMessage, nickname: user.nickname });
	//		console.log(sendDestination);
			sendMessage(sendDestination, messageToSend);
			setInputMessage('');
	//		console.log('Message sent');
		}
	};

	const handleInputMessageChange = (event) => {
		setInputMessage(event.target.value);
	};

	const handleAvatarClick = (userId) => {
		navigate(`/user/${userId}`); // 프로그래매틱 네비게이션
	};

	return (
		<Box sx={{ maxWidth: 500, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
			<Box
				id="chatBox"
				onScroll={handleBottomDetect}
				sx={{
					position: 'relative',
					height: 300,
					maxHeight: 300,
					overflowY: 'auto',
					marginBottom: 2,
					padding: 1,
					border: '1px solid #ccc',
					borderRadius: '4px',
				}}
			>
				{messages.map((message, index) => {
					const isPreviousMessageSameUser = index > 0 && message.nickname === messages[index - 1].nickname;
					const messageUser = users.find(u => u.nickname === message.nickname); // 메시지의 닉네임으로 유저 찾기
					const isCurrentUserMessage = message.nickname === user.nickname;
					// 내가 보낸 메시지와 이전 메시지가 동일한 사용자에 의해 보내진 경우, 프로필 사진을 표시하지 않음
					const showAvatar = !isCurrentUserMessage && (!isPreviousMessageSameUser || index === 0);

					return (
						<Box key={index} sx={{
							display: 'flex',
							flexDirection: isCurrentUserMessage ? 'row-reverse' : 'row',
							alignItems: 'flex-start', // 프로필 사진을 상단에 붙임
							marginTop: '2px',
							marginBottom: '2px',
						}}>
							{showAvatar && (
								<Avatar
									src={messageUser?.profile ? `${messageUser.profile}` : 'default_profile_picture_url'}
									sx={{ width: 48, height: 48, margin: isCurrentUserMessage ? '0' : '0 8px 0 0' }}
									onClick={() => messageUser?.id ? handleAvatarClick(messageUser.id) : null} // 유저 ID가 있을 때만 이벤트 리스너 추가
								/>
							)}
							{(!showAvatar && !isCurrentUserMessage) && (
								<Box sx={{ width: 48, height: 48, marginRight: '8px', visibility: 'hidden' }} />
							)}
							<Box sx={{
								display: 'flex',
								flexDirection: 'column',
								justifyContent: 'flex-start',
								maxWidth: 'calc(100% - 56px)', // 아바타 너비와 마진 고려
							}}>
								{(!isCurrentUserMessage && showAvatar) && (
									<Typography variant="caption" sx={{ marginBottom: '2px', alignSelf: 'flex-start' }}>
										{messageUser?.nickname}
									</Typography>
								)}
								<Box sx={{
									textAlign: isCurrentUserMessage ? 'right' : 'left',
									wordWrap: 'break-word',
									padding: '8px 16px',
									borderRadius: '20px',
									backgroundColor: isCurrentUserMessage ? '#0B93F6' : '#e0e0e0',
									color: isCurrentUserMessage ? '#fff' : '#000',
								}}>
									<Typography variant="body1">
										{message.content}
									</Typography>
								</Box>
							</Box>
						</Box>
					);
				})}


				<div ref={messagesEndRef} />
			</Box>
			{messages.length > 0 && Math.abs(scrollY) > 10 && (
				<IconButton onClick={scrollToBottom}
							variant="contained"
							sx={{
								position: 'absolute', // 버튼을 절대 위치로 설정
								bottom: '70px', // 채팅 입력창 위에 위치하도록 bottom 값 조정
								right: '150px', // 오른쪽 정렬을 위한 right 값 설정
								zIndex: 1, // 다른 요소들 위에 오도록 z-index 설정
							}}>
					<ArrowDownwardIcon/>
				</IconButton>
			)}
			{/* 메시지 입력창 및 기타 UI 컴포넌트 */}
			<Grid container alignItems="center"
				  borderRadius={3}>
				<Grid item xs={10}>
					<CustomChatField value={inputMessage}
									 onChange={handleInputMessageChange}
									 onKeyPress={(e) => {
										 if (e.key === 'Enter' && !e.shiftKey) { // shift 키가 눌리지 않은 상태에서 엔터 키를 감지
											 e.preventDefault(); // 엔터 키 기본 동작(새 줄 추가) 방지
						//					 console.log("Enter key pressed");
											 handleSendMessage(); // 메시지 전송 함수 호출
										 }
									 }}
					/>
				</Grid>
				<Grid item xs={2}>
					<IconButton variant="contained" onClick={handleSendMessage}>
						<SendIcon/>
					</IconButton>
				</Grid>
			</Grid>
		</Box>
	);
};

export default Chatting;
