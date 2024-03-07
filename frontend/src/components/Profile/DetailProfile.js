import {Box, Chip, Container, Typography, Slider, Button } from '@mui/material';
import Soju from '../../assets/alcohol.png';
import SojuCup from '../../assets/cup.png';
import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import FridgeModal from '../Fridge/FridgeModal';
import { useSelector } from 'react-redux';

const DetailProfile = ({intro, alcoholLimitBottle, alcoholLimitGlass, mannersScore, tags, userId, nickname, myId }) => {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const navigate = useNavigate();
	const [modalOpen, setModalOpen] = useState(false);
	const {user, isLoggedIn} = useSelector(state => state.auth);
	const isCurrentUser = isLoggedIn && String(userId) === String(myId);    // 현재 사용자의 닉네임과 비교

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	// onClick 이벤트 핸들러 정의
	const handleViewRefrigerator = () => {
		// 여기에 버튼 클릭 시 실행할 로직을 구현
	//	console.log("냉장고 보기 버튼이 클릭되었습니다.");
		setModalOpen(true);
	};

	return (<Container>
			{(nickname === user.nickname) && isLoggedIn ?
				<FridgeModal open={modalOpen} handleClose={() => setModalOpen(false)}/> :
				<FridgeModal open={modalOpen} handleClose={() => setModalOpen(false)} userId={userId}/>}
			<Box sx={{marginTop: 5, display: 'flex',  flexDirection: 'column', gap: 1}}>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						// gap: windowWidth > 600 ? 5 : 1,
						width: '100%',
						'@media (max-width: 600px)': {
							flexDirection: 'column',
						},
					}}
				>
					<Box>
						<Typography sx={{fontWeight: 'bold',}} variant="h5">
							주량
						</Typography>

						{Array.from({length: Math.min(alcoholLimitBottle, 10)}, (_, index) => (
							<img
								key={index}
								src={Soju}
								alt={`Soju Image ${index + 1}`}
								width={windowWidth > 600 ? 25 : 20}
							/>
						))}

						{Array.from({length: Math.min(alcoholLimitGlass, 10)}, (_, index) => (
							<img
								key={index}
								src={SojuCup}
								alt={`Soju Image ${index + 1}`}
								width={windowWidth > 600 ? 25 : 20}
							/>
						))}

					</Box>

					<Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'right'}}>
						<Box sx={{display: 'flex', alignItems: 'center', gap: 1, marginTop: 1}}>
							<Typography sx={{fontWeight: 'bold', color: '#00a152'}}
										variant="h5">
								소주
							</Typography>
							<Typography sx={{fontWeight: 'bold', color: '#00a152', margin: 0}}
										variant="h4">
								{alcoholLimitBottle}병 {alcoholLimitGlass}잔
							</Typography>
						</Box>
						<Typography>{intro}</Typography>
					</Box>


					<Box sx={{marginTop: 5}}>
						<Typography sx={{fontWeight: 'bold'}} variant="h5">
							선호하는 모임
						</Typography>
						<Box sx={{display: 'flex', gap: 2, marginTop: 2, flexWrap: 'wrap',  maxWidth: '100%',}}>
							{tags.map((tag) => (
								<Chip key={tag} label={tag} variant="Filled"/>
							))}
						</Box>
					</Box>
				</Box>


				<Box sx={{marginTop: 5, display: 'flex',  flexDirection: 'column', gap: 1}}>
					<Button variant="contained" color="primary" onClick={handleViewRefrigerator}>
						{isCurrentUser? "내 냉장고 꾸미기": "냉장고 보기"}
					</Button>
				</Box>
			</Box>

		</Container>
	);

}
export default DetailProfile;