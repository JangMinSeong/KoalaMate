import React, {useEffect, useState} from 'react';
import {Typography, Box, Container, Button} from '@mui/material';
import {useNavigate} from "react-router-dom";
import axios from "axios";
import style from "../RecipeBoard/RecipeList.module.css";
import RecipeItem from "../RecipeBoard/RecipeItem";
import {useSelector} from "react-redux";


const LikedRecipe = ({nickname, userId}) => {
	const navigate = useNavigate();

	// 인증 헤더를 가져오는 함수
	const getAuthHeader = () => {
		const authHeader = localStorage.getItem('authHeader');
		return authHeader ? {Authorization: authHeader} : {};
	};

	const pageNum = 1
	const sizeNum = 4;
	const [recipeData, setRecipeData] = useState([])
	const [likedRecipes, setLikedRecipes] = useState([]);
	const [totalNum, setTotalNum] = useState(0)

	const getRecipeData = async () => {
		try {
			const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userId}/likes?page=${pageNum}&size=${sizeNum}`,
				{
					headers: getAuthHeader(), // 인증 헤더 추가
				})
			const data = response.data.content
			setTotalNum(response.data.totalElements)

			// 배열 데이터를 받아온 그대로 상태에 설정
			setRecipeData(data.map(item => ({
				boardId: item.id,                       // 레시피 id
				title: item.title,                      // 레시피 이름
				content: item.content,                  // 레시피 내용
				date: item.date,                        // 작성일자
				author: item.nickname,                  // 작성자
				imageUrl: item.image,                   // 레시피 사진 URL
				ingredients: item.cocktails || [],      // 재료들
				liked: item.liked                       // 좋아요 여부
			})));

		} catch (error) {
			console.error('좋아요한 레시피 데이터를 가져오는 중 에러 발생: ', error)
		}
	}

	// 컴포넌트가 마운트될 때 데이터 가져오기
	useEffect(() => {
		getRecipeData();
	}, [userId]);

	const handleViewAllClick = () => {
		navigate(`/user/${userId}/likes`);
	};

	const toggleLikedState = async (boardId) => {
		const isLiked = likedRecipes.includes(boardId);
		const newLikedRecipes = isLiked ? likedRecipes.filter(id => id !== boardId) : [...likedRecipes, boardId];
		setLikedRecipes(newLikedRecipes);
	};


	return (
			<Box sx={{ marginTop: '30px' }}>
				<Box sx={{display: 'inline-flex', gap: 1}}>
					<Typography sx={{fontWeight: 'bold'}} variant="h5">좋아요한
						레시피</Typography>
					<Typography sx={{fontWeight: 'bold', color: '#ff9b9b'}}
					            variant="h5">{totalNum}</Typography>
				</Box>
				<Box sx={{display: 'flex', gap: 1}}>
					<Typography sx={{flexGrow: 1}}>{nickname}님이 좋아하는 칵테일 레시피예요🍹</Typography>
					<Button p={10} sx={{color: '#ff9b9b'}} onClick={handleViewAllClick}>전체보기</Button>
				</Box>
				<div className={style.cardList}>
					{recipeData.map(recipe => (
						<RecipeItem
							key={recipe.boardId}
							boardId={recipe.boardId}
							imageUrl={recipe.imageUrl}
							title={recipe.title}
							author={recipe.author}
							tags={[]}
							liked={recipe.liked}
							toggleLiked={() => toggleLikedState(recipe.boardId)}
							// liked={likedRecipes.includes(card.id)}
						/>
					))}
				</div>
			</Box>
	);
};
export default LikedRecipe;