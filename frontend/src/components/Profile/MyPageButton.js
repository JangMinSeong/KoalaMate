import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, ButtonGroup } from '@mui/material';
import {NavLink, useParams} from 'react-router-dom';
import axios from "axios";

const MyPageButton = () => {
	let userId = useParams()
	const [myId, setMyId] = useState(null); // 사용자 ID를 저장할 상태

	// 인증 헤더를 가져오는 함수
	const getAuthHeader = () => {
		const authHeader = localStorage.getItem('authHeader');
		return authHeader ? { Authorization: authHeader } : {};
	};

	const getMyId = async () => {
		try {
			const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/myId`,
				{}, { headers: getAuthHeader(), // 인증 헤더 추가
				});
			// API 응답 구조에 맞게 수정할 것
			setMyId(response.data); // 가정: 응답이 { userId: '...' } 구조를 가짐
		} catch (error) {
			console.error('내 아이디 가지고 오는 중 에러 발생: ', error);
		}
	};

	// 로그인한 사용자 정보 가져오기
	const { user, isLoggedIn } = useSelector(state => state.auth);
	let userNickname = '';
	if (isLoggedIn) {
		userNickname = user.nickname; // user가 null인 경우를 처리
	}

	// 컴포넌트 마운트 시 사용자 ID 가져오기
	useEffect(() => {
		getMyId();
	}, []);

	if (!userId.userId){
		userId = myId
	} else {
		userId = userId.userId
	}

	return (
		<>
			{myId == userId ? (
				<ButtonGroup variant="outlined" aria-label="outlined button group" sx={{ margin: '10px' }}>
					<Button component={NavLink} to={`/user/${userId}`}>내 프로필 가기</Button>
					<Button component={NavLink} to={`/user/update`}>프로필 수정</Button>
					<Button component={NavLink} to={`/user/${userId}/follower`}>팔로워</Button>
					<Button component={NavLink} to={`/user/${userId}/followee`}>팔로잉</Button>
				</ButtonGroup>
			) : (
				<ButtonGroup variant="outlined" aria-label="outlined button group" sx={{ margin: '10px' }}>
					<Button component={NavLink} to={`/user/${myId}`}>내 프로필 가기</Button>
					<Button component={NavLink} to={`/user/${userId}/follower`}>팔로워</Button>
					<Button component={NavLink} to={`/user/${userId}/followee`}>팔로잉</Button>
				</ButtonGroup>
			)}
		</>
	);
};

export default MyPageButton;
