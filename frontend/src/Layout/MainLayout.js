import React, { useState } from 'react';
import {
	Drawer,
	Box,
	IconButton, styled, Container,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import Nav from '../components/Nav';
import { Route, Routes } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import WriteBoard from '../pages/WriteBoard';
import CommentList from '../components/Comment/CommentList';
import Footer from '../components/Footer';
import Chattings from '../components/Chattings';
import Toolbar from '@mui/material/Toolbar';
import Recipe from '../pages/Recipe';
import RecipeDetail from '../pages/RecipeDetail';
import Chatting from '../components/Chatting';
import MyPage from '../pages/MyPage';
import FollowerList from '../pages/FollowerList';
import FolloweeList from '../pages/FolloweeList';
import Mate from '../pages/Mate';
import UpdateMyPage from '../pages/UpdateMyPage';
import VoiceChatRoom from '../components/VoiceChatRoom';
import ModifyFridge from '../components/Fridge/ModifyFridge';
import ModifyFridgeInside from '../components/Fridge/ModifyFridgeInside';
import MyPosts from "../pages/MyPosts";
import MyLikes from "../pages/MyLikes";
import IngredientDetail from "../pages/IngredientDetail";
import ShowFridge from "../components/Fridge/ShowFridge";
import ShowFridgeInside from "../components/Fridge/ShowFridgeInside";
import chattingicon from "../assets/chattingicon.png";
import SearchResult from "../pages/SearchResult";
import WriteDrink from "../pages/WriteDrink";


const CustomScrollBox = styled(Box)(({ theme }) => ({
	overflowY: 'auto', // 세로 스크롤바 활성화
	maxHeight: '100%', // 높이 제한 설정
	'&::-webkit-scrollbar': {
		width: '10px', // 스크롤바 너비 설정
	},
	'&::-webkit-scrollbar-track': {
		backgroundColor: theme.palette.grey[200], // 스크롤바 트랙 색상 설정
	},
	'&::-webkit-scrollbar-thumb': {
		backgroundColor: theme.palette.grey[400], // 스크롤바 썸(이동하는 부분) 색상 설정
		borderRadius: '5px', // 스크롤바 썸의 모서리 둥글게 설정
	},
	'&::-webkit-scrollbar-thumb:hover': {
		backgroundColor: theme.palette.grey[500] // 스크롤바 썸 호버 시 색상 변경 (분홍색)
	},
}));

const MainLayout = () => {
	const [isOpen, setIsOpen] = useState(false);
	const { isLoggedIn } = useSelector(state => state.auth);

	const toggleDrawer = (open) => {
	//	console.log("toggleDrawer: ", open);
		setIsOpen(open);
	};

	return (
		<Box
			sx={(theme) => ({
				width: '100%',
				backgroundImage:
					theme.palette.mode === 'light'
					? 'linear-gradient(180deg, #FFDFDF,  #FFF)'

					: 'linear-gradient(#4f024b, #10090f)',
				backgroundSize: '100% 20vh',
				backgroundRepeat: 'no-repeat',
			})}
			>
			<Container
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					pt: { xs: 14, sm: 20 },
					pb: { xs: 8, sm: 12 },
				}}
			>

		<Box sx={{ width: '100%', transition: 'margin 0.3s ease-out', marginRight: isLoggedIn && isOpen ? '350px' : 0 }}>

			{isLoggedIn && !isOpen && (
				<IconButton onClick={() => toggleDrawer(true)} sx={{ position: 'fixed', right: 30, bottom: 30, zIndex: 1300 }}>
					<img src={chattingicon} style={{width: 60, height: 60}}/>
				</IconButton>
			)}

			{isLoggedIn && (
				<Drawer variant={'persistent'} anchor="right" open={isOpen} onClose={() => toggleDrawer(false)} >
					<CustomScrollBox>
						{/*<Box sx={{ height: '100%', overflow: 'auto' }}> /!* Drawer의 내용이 스크롤될 수 있도록 설정 *!/*/}
							<Toolbar sx={{ position: 'sticky', top: 0, zIndex: 1100, backgroundColor: grey[200] }}>
								<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
									채팅방
								</Typography>
								<IconButton onClick={() => toggleDrawer(false)} >
									<CloseIcon />
								</IconButton>
							</Toolbar>
							<Box sx={{ width: 350 }} role="presentation">
								{isOpen && (<Chattings />)}
							</Box>
						{/*</Box>*/}
					</CustomScrollBox>
				</Drawer>
			)}

			<Nav isDrawerOpen={isOpen} />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/mate" element={<Mate />} />

				<Route path="/recipe" element={<Recipe/>} />
				{/*<Route path="/recipe/search" element={<Search/>}/>*/}
				<Route path="/recipe/:boardId" element={<RecipeDetail /> } />

				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/writeBoard" element={<WriteBoard />} />
				<Route path="/:boardId/comments" element={<CommentList />} />
				<Route path="/user/:userId" element={<MyPage />} />
				<Route path="/user/update" element={<UpdateMyPage />} />

				{/*<Route path="/user/:userId/update" element={<WriteMyPage />} />*/}

				<Route path="/user/:userId/follower" element={<FollowerList />} />
				<Route path="/user/:userId/followee" element={<FolloweeList />} />
				<Route path="/user/:userId/posts" element={<MyPosts />} />
				<Route path="/user/:userId/likes" element={<MyLikes />} />
				<Route path="/fridge" element={<ModifyFridge />} />
				<Route path="/fridge/:userId" element={<ShowFridge />} />
				<Route path="/fridgeInside" element={<ModifyFridgeInside />} />
				<Route path="/fridgeInside/:userId" element={<ShowFridgeInside />} />
				<Route path="/voiceChat/:roomId" element={<VoiceChatRoom />} />
				<Route path="/ingredient/:ingredientId" element={<IngredientDetail />} />
				<Route path="/writeDrink" element={<WriteDrink />} />

				{/* 다른 라우트들 */}
			</Routes>
			<Footer />
		</Box>
			</Container>
		</Box>
	);
};

export default MainLayout;
