import React, {useState, useEffect} from 'react';
import {Typography, Box, Container, Button, Tooltip } from '@mui/material';
import QueueIcon from '@mui/icons-material/Queue';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import style from '../RecipeBoard/RecipeList.module.css';
import RecipeItem from '../RecipeBoard/RecipeItem';
import axios from "axios";

const MyRecipe = ({nickname, userId, myId}) => {
    const navigate = useNavigate();
    const {user, isLoggedIn} = useSelector(state => state.auth);
    const isCurrentUser = isLoggedIn && String(userId) === String(myId);    // 현재 사용자의 닉네임과 비교

    // 인증 헤더를 가져오는 함수
    const getAuthHeader = () => {
        const authHeader = localStorage.getItem('authHeader');
        return authHeader ? {Authorization: authHeader} : {};
    };

    const pageNum = 1
    const sizeNum = isCurrentUser ? 3 : 4
    const [recipeData, setRecipeData] = useState([])
    const [likedRecipes, setLikedRecipes] = useState([]);
    const [totalNum, setTotalNum] = useState(0)

    const getRecipeData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userId}/posts?page=${pageNum}&size=${sizeNum}`,
                {
                    headers: getAuthHeader(), // 인증 헤더 추가
                })
            const data = response.data.content
            setTotalNum(response.data.totalElements)

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
            console.error('유저가 작성한 레시피 데이터를 가져오는 중 에러 발생: ', error)
        }
    }

    useEffect(() => {
        // console.log('isLoggedIn:', isLoggedIn, 'user.nickname:', user.nickname, 'nickname:', nickname, 'isCurrentUser:', isCurrentUser, 'sizeNum:', sizeNum);
        getRecipeData()
    }, [sizeNum, userId]);

    const handleViewAllClick = () => {
        navigate(`/user/${userId}/posts`);
    };

    const toggleLikedState = async (boardId) => {
        const isLiked = likedRecipes.includes(boardId);
        const newLikedRecipes = isLiked ? likedRecipes.filter(id => id !== boardId) : [...likedRecipes, boardId];
        setLikedRecipes(newLikedRecipes);
    };

    return (
        <Box sx={{marginTop: '30px'}}>
            <Box sx={{display: 'inline-flex', gap: 1}}>
                <Typography sx={{fontWeight: 'bold'}} variant="h5">
                    {isCurrentUser ? '나만의' : `${nickname}의`} 레시피
                </Typography>
                <Typography sx={{fontWeight: 'bold', color: '#ff9b9b'}}
                            variant="h5">{totalNum}</Typography>
            </Box>
            <Box sx={{display: 'flex', gap: 1}}>
                <Typography sx={{flexGrow: 1}}>{nickname}님의 칵테일 레시피예요🍸</Typography>
                <Button p={10} sx={{color: '#ff9b9b'}} onClick={handleViewAllClick}>전체보기</Button>
            </Box>

            <Box sx={{display: 'flex', justifyContent: 'start'}}>
                {/*<div  className={`${style.cardList} ${style.justifyStart}`}>*/}
                <div className={`${style.cardList} ${style.justifyStart}`}>
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

                {isCurrentUser && (
                    <Tooltip title="나만의 레시피 작성하러 가기">
                        <NavLink to="/writeBoard" style={{
                            textDecoration: 'none',
                            color: 'inherit',
                            margin: '20px 0',
                            width: '240px',
                            height: '375px',
                            backgroundColor: 'transparent',
                            border: '2px solid #ff9b9b',
                            borderRadius: '15px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <QueueIcon sx={{fontSize: 48, color: '#ff9b9b'}}/>
                        </NavLink>
                    </Tooltip>
                )}
            </Box>
        </Box>
    );
};
export default MyRecipe;