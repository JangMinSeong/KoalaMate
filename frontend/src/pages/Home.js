import React, { useEffect, useRef, useState } from 'react';
import {
	Box,
	Button,
	Container, Link,
	Modal,
	Paper, TextField,
	Typography,
} from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import ImageSlider from 'components/home/ImageSlider';
import HomeRecipeList from '../components/home/HomeRecipeList';
import SimpleMap from 'components/home/SimpleMap';
import Stack from '@mui/material/Stack';
import { useSelector } from 'react-redux';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollAnimationCanvas from '../components/ScrollAnimationCanvas';

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Home = () => {
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [email, setEmail] = useState('');

	const { isLoggedIn } = useSelector((state) => state.auth);

	const navigate = useNavigate();

	const images = useRef([]);
	const totalFrames = 100; // 애니메이션 프레임 총 개수
	let currentFrame = 0; // 현재 프레임
	const canvasRef = useRef(null);

	const main = React.useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');
		canvas.width = 1920; // 캔버스 너비 설정
		canvas.height = 1080; // 캔버스 높이 설정

		// 글자 오버레이 요소
		const textOverlay = document.getElementById('textOverlay');

		for (let i = 1; i <= totalFrames; i++) {
			const img = new Image();
			img.src = `${process.env.REACT_APP_IMAGE_URL}/assets/intro/${i.toString()
				.padStart(4, '0')}.png`;
			img.onload = () => {
				if (i === 1) { // 첫 번째 이미지에 대한 처리
					context.drawImage(img, 0, 0, canvas.width, canvas.height);
				}
			};
			images.current.push(img);
		}

		ScrollTrigger.create({
			trigger: '#pinContainer',
			pin: true,
			start: 'top top',
			end: '+=2000',
			scrub: true,
			onUpdate: (self) => {
				const progress = self.progress; // 0에서 1 사이의 값
				const frameIndex = Math.min(Math.floor(progress * totalFrames),
					totalFrames - 1);
				context.clearRect(0, 0, canvas.width, canvas.height);
				if (images.current[frameIndex].complete) { // 이미지가 로드되었는지 확인
					context.drawImage(images.current[frameIndex], 0, 0, canvas.width,
						canvas.height);
				}
			},
		});

		// 글자 페이드인/아웃 애니메이션
		gsap.fromTo(textOverlay,
			{ opacity: 0 },
			{
				opacity: 1,
				duration: 1,
				scrollTrigger: {
					trigger: '#pinContainer',
					start: 'top top',
					end: 'bottom -2000px',
					scrub: true,
				},
			},
		);

		gsap.to(canvasRef.current, {
			x: () => -window.innerWidth * 0.12, // 화면의 절반 크기만큼 왼쪽으로 이동
			ease: "power3",
			scrollTrigger: {
				trigger: "#pinContainer",
				start: "top top",
				end: "+=2000",
				scrub: true,
			},
		});
		// textOverlay를 오른쪽으로 움직이는 애니메이션
		gsap.to("#textOverlay", {
			x: () => window.innerWidth * 0.12, // 화면의 절반 크기만큼 오른쪽으로 이동
			ease: "power3",
			scrollTrigger: {
				trigger: "#pinContainer",
				start: "top top",
				end: "+=2000",
				scrub: true,
			},
		});

		return () => {
			ScrollTrigger.getAll().forEach(trigger => trigger.kill());
		};
	}, [isLoggedIn]);

	// 이메일 입력값 변경 핸들러
	const handleEmailChange = (event) => {
		setEmail(event.target.value);
	};

	// "Start now" 버튼 클릭 핸들러
	const handleStartNow = () => {
		// 이메일 값과 함께 회원가입 페이지로 이동
		navigate('/signup', { state: { email } });
	};

	const style = {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: '100%',
		height: '100%',
		bgcolor: 'rgba(0, 0, 0, 1)',
		border: 'none',
		boxShadow: 24,
		p: 4,
		overflow: 'hidden',
	};

	return (
		<div>
			<Container sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}} ref={main}>
				{!isLoggedIn &&
					<Stack spacing={2} useFlexGap
					       sx={{ width: { xs: '100%', sm: '70%' } }} mb={10}>
						<Typography
							component="h1"
							variant="h1"
							sx={{
								display: 'flex',
								flexDirection: { xs: 'column', md: 'row' },
								alignSelf: 'center',
								textAlign: 'center',
							}}
						>
							코알라&nbsp;
							<Typography
								component="span"
								variant="h1"
								sx={{
									color: (theme) =>
										theme.palette.mode === 'light'
											? 'primary.main'
											: 'primary.light',
								}}
							>
								메이트
							</Typography>
						</Typography>
						<Typography variant="body1" textAlign="center"
						            color="text.secondary">
							주변의 술 친구를 찾고 공유하고 소통해보세요. <br/>
							냉장고 꾸미기로 개성을 표현하고 취향에 맞는 친구를 찾아보세요.
						</Typography>
						<Stack
							direction={{ xs: 'column', sm: 'row' }}
							alignSelf="center"
							spacing={1}
							useFlexGap
							sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
						>
							<form onSubmit={(event => {
								event.preventDefault();
								handleStartNow();
							})}
							      style={{ display: 'flex', gap: '16px' }}
							>
								<TextField
									id="outlined-basic"
									hiddenLabel
									size="small"
									variant="outlined"
									aria-label="Enter your email address"
									placeholder="Your email address"
									value={email}
									onChange={handleEmailChange}
								/>
								<Button type="susbmit" variant="contained" color="primary">
									지금 시작
								</Button>
							</form>
						</Stack>
						<Typography variant="caption" textAlign="center"
						            sx={{ opacity: 0.8 }}>
							&quot;지금 시작&quot; 버튼을 클릭하면 &nbsp;
							<Link href="#" color="primary">
								Terms & Conditions
							</Link>
							에 동의하는 것으로 간주합니다.
						</Typography>
					</Stack>
				}
				<Box mb={-10} sx={{ width: '100%' }}> {/* 화면 전체 너비를 가지도록 설정 */}
					<ImageSlider/>
				</Box>

				<Box id="pinContainer">
					<Typography variant={'h1'} id="textOverlay" sx={{
						position: 'fixed', top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						zIndex: 2,
					}}><Typography
						component="span"
						variant="h1"
						sx={{
							color: (theme) =>
								theme.palette.mode === 'light'
									? 'primary.main'
									: 'primary.light',
						}}
					>
						'냉꾸'
					</Typography>로 개성을<br/>표현하세요</Typography>
					<canvas id="canvas" ref={canvasRef}
					        style={{ height: '100vh' }} key={isLoggedIn ? 'Logged-in' : 'Logged-out'}></canvas>
				</Box>
				<Box sx={{ height: '2000px' }}></Box>

				<Box mb={10}>
					<Typography variant={'h4'} align={'center'}>
						궁금한 레시피
					</Typography>
					<Typography variant={'h6'} color="text.secondary" align={'center'}
					            margin={2}>
						너무나 복잡한 칵테일 레시피, 쉽게 찾고 공유해요
					</Typography>
					<HomeRecipeList optionNum={1} currentPage={5}/>
				</Box>

				<Typography variant={'h4'} align={'center'}>
					내 주변의 냉장고 & 메이트 찾기
				</Typography>
				<Typography variant={'h6'} color="text.secondary" align={'center'}
				            margin={2}>
					같이 마실래요? 우리 동네에서 함께 마실 친구도 구해요
				</Typography>
				<Box mb={4} sx={{
					width: '100%',
					height: '600px',
					maxWidth: '1200px',
					margin: '0 auto',
					borderRadius: '15px',
					overflow: 'hidden', // 이 부분 추가
				}}>

					<SimpleMap sx={{ width: '100%', height: '100%' }}/>
				</Box>
			</Container>
		</div>
	);
};

export default Home;