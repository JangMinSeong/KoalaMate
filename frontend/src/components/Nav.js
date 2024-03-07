import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Box,
	IconButton,
	Menu,
	Tooltip, MenuItem, Avatar, createTheme, Container, useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Collapse from '@mui/material/Collapse';
import { useDispatch, useSelector } from 'react-redux';
import { setLoginStatus } from '../store/authSlice';
import logoImage from 'assets/logo3.png';
import axios from 'axios';
import { useWebSocket } from 'context/WebSocketContext';
import { useVoiceSocket } from 'context/VoiceSocketContext';
import { styled } from '@mui/material/styles';
import NoImage from '../assets/profile.jpg';

const Nav = ({isDrawerOpen}) => {
	const { isLoggedIn } = useSelector(state => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { disconnect, setRoomStatus } = useWebSocket();
	const [anchorEl, setAnchorEl] = useState(null); // 메뉴 상태 관리
	const [anchorElUser, setAnchorElUser] = useState(null); // 유저 메뉴 상태 관리
	const [menuOpen, setMenuOpen] = useState(false);
	const { disconnectSession } = useVoiceSocket();
	const [isWide, setIsWide] = useState(false);
	const theme = createTheme();
	const ref = React.useRef(null);
	const matches = useMediaQuery(theme.breakpoints.down('md'));
	const [profileImageUrl, setProfileImageUrl] = useState(null);

	useEffect(() => {
		const checkWidth = () => {
			if (ref.current) {
				setIsWide(ref.current.offsetWidth >= theme.breakpoints.values.md);
			}
		};
		const resizeObserver = new ResizeObserver(checkWidth);
		if (ref.current) {
			resizeObserver.observe(ref.current);
		}
		checkWidth();

		return () => resizeObserver.disconnect();
	}, [ref]);

	useEffect(() => {
		if (!isLoggedIn) return;
		try {
			axios.post(`${process.env.REACT_APP_API_URL}/user/myId`, {}, {
				headers: {
					'Authorization': localStorage.getItem('authHeader'),
				},
			}).then((res) => {
				axios.get(`${process.env.REACT_APP_API_URL}/profile/${res.data}`)
					.then((res) => {
						setProfileImageUrl(res.data.profile);
					});
			});
		} catch (error) {
			console.log(error.log);
		}

	}, [isLoggedIn]);

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
		setMenuOpen(!menuOpen);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleOpenUserMenu = (event) => {
		setAnchorElUser(event.currentTarget);
	};

	const handleCloseUserMenu = () => {
		setAnchorElUser(null);
	};

	const handleLogout = async () => {
		dispatch(setLoginStatus(false));
		navigate('/');
	};

	const handleMyPage = async () => {
		setAnchorElUser(null);
		try {
			const authHeader = localStorage.getItem('authHeader');
			const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/myId`,
				{}, {
					headers: {
						'Authorization': authHeader,
					},
					withCredentials: true,
				});
	//		console.log(res);
			navigate(`/user/${res.data}`);
		} catch (error) {
			console.log(error);
		}
	};

	const NavButton = styled(Button)({
		margin: '0 20px',
		fontSize: '1rem',
		fontWeight: 700,
		letterSpacing: '.2rem',
		color: '#888',
		':hover': {
			color: '#000',
			backgroundColor: 'transparent',
		},
	});

	const settings = [
		{ name: '마이페이지', action: handleMyPage },
		{ name: '로그아웃', action: handleLogout },
	];

	return (
		// https://github.com/mui/material-ui/blob/v5.15.9/docs/data/material/getting-started/templates/landing-page/components/AppAppBar.js
		<AppBar position="fixed" sx={{
			boxShadow: 0,
			backgroundColor: 'transparent',
			backgroundImage: 'none',
			mt: 2,
		}} ref={ref}>
			<Container maxWidth="lg" sx={{
				transition: 'padding-right 0.5s cubic-bezier(.53,0,.65,1.38)',
				...(isDrawerOpen && { '@media (min-width: 600px)': {paddingRight: '374px'}}),
			}} >
				<Toolbar
					variant="regular"
					sx={(theme) => ({
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						flexShrink: 0,
						borderRadius: '999px',
						bgcolor: theme.palette.mode === 'light'
							? 'rgba(255, 255, 255, 0.4)'
							: 'rgba(0, 0, 0, 0.4)',
						backdropFilter: 'blur(24px)',
						maxHeight: 40,
						border: '1px solid',
						borderColor: 'divider',
						boxShadow: theme.palette.mode === 'light'
							? `0 0 1px rgba(255, 155, 155, 0.1), 1px 1.5px 2px -1px rgba(255, 155, 155, 0.15), 4px 4px 12px -2.5px rgba(255, 155, 155, 0.15)`
							: '0 0 1px rgba(59, 2, 57, 0.7), 1px 1.5px 2px -1px rgba(59, 2, 57, 0.65), 4px 4px 12px -2.5px rgba(59, 2, 57, 0.65)',
					})}>
					<Box sx={{
						flexGrow: 1,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
						ml: '-5px',
						px: 0,
					}}>
						<NavLink to="/" style={{
							display: 'flex',
							alignItems: 'center',
							color: 'inherit',
							textDecoration: 'inherit',
						}}>
							<img src={logoImage} alt="Logo" style={{ maxHeight: '55px' }}/>
							{!matches && (
								<Typography variant="h5" color="text.primary" ml={2}>
									코알라 메이트
								</Typography>
							)}
						</NavLink>
						<Box sx={{ display: 'flex', mr: '50px' }}>
							<MenuItem sx={{ py: '6px', px: '12px' }}
							          onClick={() => {navigate('/mate');}}>
								<Typography variant="body2"
								            color="text.primary">Mate</Typography>
							</MenuItem>
							<MenuItem sx={{ py: '6px', px: '12px' }}
							          onClick={() => {navigate('/recipe');}}>
								<Typography variant="body2"
								            color="text.primary">Recipe</Typography>
							</MenuItem>
							{isLoggedIn &&
								<>
									<MenuItem sx={{ py: '6px', px: '12px' }}
									          onClick={() => {navigate('/writeBoard');}}>
										<Typography variant="body2"
										            color="text.primary">Write</Typography>
									</MenuItem>
								</>
							}
						</Box>

					{isLoggedIn ?
						<Box sx={{
							display: 'flex',
							gap: 0.5,
							alignItems: 'center',
						}}>
							<Box sx={{ flexGrow: 0, display: 'flex' }}>
								{/*Profile Image*/}
								<Box sx={{ flexGrow: 0 }}>
									<Tooltip title="Open settings">
										<IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
											<Avatar alt="Remy Sharp"
											        src={profileImageUrl ? profileImageUrl : NoImage}
											        // src="/static/images/avatar/2.jpg"
													sx={{ bgcolor: '#FF9B9B'}}
											/>
										</IconButton>
									</Tooltip>
									<Menu
										sx={{ mt: '45px' }}
										id="menu-appbar"
										anchorEl={anchorElUser}
										anchorOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										keepMounted
										transformOrigin={{
											vertical: 'top',
											horizontal: 'right',
										}}
										open={Boolean(anchorElUser)}
										onClose={handleCloseUserMenu}
									>
										{settings.map((setting) => (
											<MenuItem key={setting.name} onClick={setting.action
												? setting.action
												: handleCloseUserMenu}>
												{setting.path ? (
													<NavLink to={setting.path} style={{
														textDecoration: 'none',
														color: 'inherit',
														width: '100%',
													}}>
														<Typography
															textAlign="center">{setting.name}</Typography>
													</NavLink>
												) : (
													<Typography textAlign="center"
													            style={{ width: '100%' }}>{setting.name}</Typography>
												)}
											</MenuItem>
										))}
									</Menu>
								</Box>
							</Box>
						</Box>
						:
						<Box sx={{
							display: 'flex',
							gap: 0.5,
							alignItems: 'center',
						}}>
							<Button
								color="primary"
								variant="text"
								size="small"
								component="a"
								href="/login"
							>
								Sign in
							</Button>
							<Button
								color="primary"
								variant="contained"
								size="small"
								component="a"
								href="/signup"
							>
								Sign up
							</Button>
						</Box>
					}
					</Box>

				</Toolbar>
				{/*<Toolbar sx={{ display: isWide ? 'none' : 'flex' }}*/}
				{/*         onMouseEnter={() => setMenuOpen(true)}*/}
				{/*         onMouseLeave={() => setMenuOpen(false)}>*/}
				{/*	<Box sx={{*/}
				{/*		flexGrow: 1,*/}
				{/*		display: 'flex',*/}
				{/*		justifyContent: 'space-between',*/}
				{/*		alignItems: 'center',*/}
				{/*		color: 'inherit',*/}
				{/*		textDecoration: 'inherit',*/}
				{/*	}}>*/}
				{/*		<NavLink to="/" style={{*/}
				{/*			display: 'flex',*/}
				{/*			alignItems: 'center',*/}
				{/*			color: 'inherit',*/}
				{/*			textDecoration: 'inherit',*/}
				{/*		}}>*/}
				{/*			<img src={logoImage} alt="Logo" style={{ maxHeight: '50px' }}/>*/}
				{/*		</NavLink>*/}
				{/*		<Box*/}
				{/*			sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>*/}
				{/*			<IconButton size="large" aria-label="menu"*/}
				{/*			            aria-controls="menu-appbar"*/}
				{/*			            aria-haspopup="true" onClick={handleMenu}>*/}
				{/*				<MenuIcon/>*/}
				{/*			</IconButton>*/}
				{/*		</Box>*/}
				{/*	</Box>*/}
				{/*	<Collapse in={menuOpen}>*/}
				{/*		<Box sx={{*/}
				{/*			display: 'flex',*/}
				{/*			flexDirection: 'column',*/}
				{/*			alignItems: 'center',*/}
				{/*			pb: 2,*/}
				{/*		}}>*/}
				{/*			<NavButton color="inherit" component={NavLink} to="/mate"*/}
				{/*			           onClick={() => setMenuOpen(false)}>Mate</NavButton>*/}
				{/*			<NavButton color="inherit" component={NavLink} to="/1/comments"*/}
				{/*			           onClick={() => setMenuOpen(false)}>Comments</NavButton>*/}
				{/*			<NavButton color="inherit" component={NavLink} to="/recipe"*/}
				{/*			           onClick={() => setMenuOpen(false)}>Recipe</NavButton>*/}
				{/*			{isLoggedIn ? (*/}
				{/*				<>*/}
				{/*					<NavButton color="inherit" component={NavLink}*/}
				{/*					           to="/writeBoard"*/}
				{/*					           onClick={() => setMenuOpen(*/}
				{/*						           false)}>Write</NavButton>*/}
				{/*					<NavButton color="inherit"*/}
				{/*					           onClick={handleLogout}>Logout</NavButton>*/}
				{/*				</>*/}
				{/*			) : (*/}
				{/*				<>*/}
				{/*					<NavButton color="inherit" component={NavLink} to="/login"*/}
				{/*					           onClick={() => setMenuOpen(*/}
				{/*						           false)}>Login</NavButton>*/}
				{/*					<NavButton color="inherit" component={NavLink} to="/signup"*/}
				{/*					           onClick={() => setMenuOpen(*/}
				{/*						           false)}>SignUp</NavButton>*/}
				{/*				</>*/}
				{/*			)}*/}
				{/*		</Box>*/}
				{/*	</Collapse>*/}
				{/*	/!*<Menu id="menu-appbar" anchorEl={anchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={open} onClose={handleClose}>*!/*/}
				{/*	/!*	<MenuItem onClick={handleClose} component={NavLink} to="/about">About</MenuItem>*!/*/}
				{/*	/!*	<MenuItem onClick={handleClose} component={NavLink} to="/1/comments">Comments</MenuItem>*!/*/}
				{/*	/!*	<MenuItem onClick={handleClose} component={NavLink} to="/recipe">Recipe</MenuItem>*!/*/}
				{/*	/!*	{isLoggedIn ? (*!/*/}
				{/*	/!*			<>*!/*/}
				{/*	/!*				<MenuItem onClick={handleClose} component={NavLink} to="/writeBoard">Write</MenuItem>*!/*/}
				{/*	/!*				<MenuItem onClick={handleLogout}>Logout</MenuItem>*!/*/}
				{/*	/!*			</>*!/*/}
				{/*	/!*	) : (*!/*/}
				{/*	/!*			<>*!/*/}
				{/*	/!*				<MenuItem onClick={handleClose} component={NavLink} to="/login">Login</MenuItem>*!/*/}
				{/*	/!*				<MenuItem onClick={handleClose} component={NavLink} to="/signup">SignUp</MenuItem>*!/*/}
				{/*	/!*			</>*!/*/}
				{/*	/!*	)}*!/*/}
				{/*	/!*</Menu>*!/*/}
				{/*</Toolbar>*/}
			</Container>
		</AppBar>
	);
};

export default Nav;