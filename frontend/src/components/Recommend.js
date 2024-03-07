import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import RecipeItem from "./RecipeBoard/RecipeItem";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import style from "./RecipeBoard/RecipeList.module.css";
const Recommend = ({ cocktails }) => {
    const [index, setIndex] = useState(0); // 현재 슬라이드 인덱스
    const [likedRecipes, setLikedRecipes] = useState([]);
    // 이전 슬라이드로 이동
    const handlePrev = () => {
        setIndex(Math.max(0, index - 1));
    };

    // 다음 슬라이드로 이동
    const handleNext = () => {
        setIndex(Math.min(cocktails.length - 1, index + 1));
    };

    const toggleLikedState = async (boardId) => {
        const isLiked = likedRecipes.includes(boardId);
        const newLikedRecipes = isLiked ? likedRecipes.filter(id => id !== boardId) : [...likedRecipes, boardId];
        setLikedRecipes(newLikedRecipes);
    };

    // cocktails.map(it => console.log(it.boardId, it.liked, it.imageUrl))

    return (
        <Box marginTop={5}>
            <hr/>
            <Box marginTop={2} sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                <Typography sx={{fontWeight: 'bold'}} variant="h5">
                    🍸 해당 재료로 만들 수 있는 칵테일
                </Typography>
                <Typography sx={{fontWeight: 'bold', color: '#ff9b9b'}} variant="h5">
                    {cocktails.length}
                </Typography>
            </Box>

            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2}}>
                <IconButton onClick={handlePrev} disabled={index === 0}>
                    <ArrowBackIosIcon/>
                </IconButton>
                <SwipeableViews enableMouseEvents index={index} onChangeIndex={setIndex}>
                    {Array.from({length: Math.ceil(cocktails.length / 3)}, (_, index) => (
                        <Box key={index} display="flex" justifyContent="center" padding={1} className={style.cardList}>
                            {cocktails.slice(index * 3, (index + 1) * 3).map((cocktail) => (
                                <RecipeItem
                                    key={cocktail.boardId}
                                    boardId={cocktail.boardId}
                                    imageUrl={cocktail.imageUrl}
                                    title={cocktail.title}
                                    author={cocktail.author}
                                    liked={cocktail.liked}
                                    toggleLiked={() => toggleLikedState(cocktail.boardId)}
                                    tags={[]}
                                />
                            ))}
                        </Box>
                    ))}
                </SwipeableViews>
                <IconButton onClick={handleNext} disabled={index === Math.ceil(cocktails.length / 3) - 1}>
                    <ArrowForwardIosIcon/>
                </IconButton>
            </Box>
        </Box>
    );
};

export default Recommend;
