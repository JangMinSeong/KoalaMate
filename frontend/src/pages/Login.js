import React from 'react';
import axios from 'axios';
import {Box, Button, Container, TextField, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {setLoading, setLoginStatus} from '../store/authSlice';
import {useWebSocket} from 'context/WebSocketContext';
//import {useVoiceSocket} from 'context/VoiceSocketContext';

const Login = () => {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {connect, setRoomStatus} = useWebSocket();
	//const {connectVoice} = useVoiceSocket();

	const login = async (email, password) => {
		try {
	//		console.log(`${process.env.REACT_APP_API_URL}/user/login`)
			return await axios.post(`${process.env.REACT_APP_API_URL}/user/login`, {
				email,
				password,
			}, {withCredentials: true});
		} catch (error) {
			console.log('Login Error: ', error);
			throw error;
		}
	};

	const getRoomList = async () => {
		try {
			const authHeader = localStorage.getItem('authHeader');
	//		console.log('Auth Header: ', authHeader);
			return await axios.post(`${process.env.REACT_APP_API_URL}/chatroom/roomlist`, {},{
				headers: {
					'Authorization': authHeader,
				},
				withCredentials: true});
		} catch (error) {
			console.log('Get Room List Error: ', error);
			throw error;
		}
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
	//	console.log('Login: ', email, password);
		dispatch(setLoading(true));

		login(email, password)
		.then((response) => {
	//		console.log(response);
			const authHeader = response.headers['authorization'];
			if (!authHeader) throw new Error('No Authorization Header');
			localStorage.setItem('authHeader', authHeader);
			getRoomList()
				.then((response) => {
	//				console.log("asdfasdf: ",response.data);
					setRoomStatus(response.data);
					sessionStorage.setItem('roomList', JSON.stringify(response.data));
				}).catch((error) => {
					console.log('Get Room List Failed: ', error);
				});
			dispatch(setLoginStatus({isLoggedIn: true, user: response.data}));
			connect(`${process.env.REACT_APP_CHAT_URL}`);
	//		console.log(response.data);


			navigate('/');
		}).catch((error) => {
			console.log('Login Failed: ', error);
			dispatch(setLoginStatus(false));
		}).finally(() => {
			dispatch(setLoading(false));
		});
	};

	return (
			<Container maxWidth="xs">
				<Box sx={{
					marginTop: 8,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}>
					<Typography component="h1" variant="h5">
						로그인
					</Typography>
					<Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
						<TextField
								margin="normal"
								required
								fullWidth
								id="email"
								label="이메일"
								name="email"
								autoComplete="email"
								autoFocus
								value={email}
								onChange={(e) => setEmail(e.target.value)}
						/>
						<TextField
								margin="normal"
								required
								fullWidth
								name="password"
								label="비밀번호"
								type="password"
								id="password"
								autoComplete="current-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
						/>
						<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{mt: 3, mb: 2}}
						>
							Sign In
						</Button>
					</Box>
				</Box>
			</Container>
	);
};

export default Login;