import {useParams} from "react-router-dom";
import React, {useState, useEffect} from "react";
import axios from "axios";
import MyPageButton from "../components/Profile/MyPageButton";
import {Box, Container, Typography} from "@mui/material";
import style from "../components/RecipeBoard/RecipeList.module.css";
import RecipeItem from "../components/RecipeBoard/RecipeItem";
import PaginationComponent from "../components/PaginationComponent";

const MyLikes = () => {
    const userId = useParams()
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

    const sizeNum = 8;

    const [recipeData, setRecipeData] = useState([])
    const [likedRecipes, setLikedRecipes] = useState([]);
    const [totalNum, setTotalNum] = useState(0)

    // 인증 헤더를 가져오는 함수
    const getAuthHeader = () => {
        const authHeader = localStorage.getItem('authHeader');
        return authHeader ? {Authorization: authHeader} : {};
    };


    const getRecipeData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userId.userId}/likes?page=${currentPage}&size=${sizeNum}`,
                {
                    headers: getAuthHeader(), // 인증 헤더 추가
                })
            const data = response.data.content
            setTotalPages(response.data.totalPages)
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
            console.error('데이터를 가져오는 중 에러 발생: ', error)
        }
    }

    useEffect(() => {
        getRecipeData();
    }, [currentPage]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const toggleLikedState = async (boardId) => {
        const isLiked = likedRecipes.includes(boardId);
        const newLikedRecipes = isLiked ? likedRecipes.filter(id => id !== boardId) : [...likedRecipes, boardId];
        setLikedRecipes(newLikedRecipes);
    };


    return(
        <>
            <MyPageButton />
            <Container sx={{marginTop: '30px'}}>

                <Box sx={{display: 'inline-flex', gap: 1}}>
                    <Typography sx={{fontWeight: 'bold'}} variant="h5">
                        레시피</Typography>
                    <Typography sx={{fontWeight: 'bold', color: '#ff9b9b'}}
                                variant="h5">{totalNum}</Typography>
                </Box>

                <Box sx={{display: 'flex'}}>
                    <div className={style.cardList}>
                        {recipeData.map(recipe => (
                            <RecipeItem
                                key={recipe.boardId}                // key는 각 요소를 고유하게 식별하기 위해 사용
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
                <PaginationComponent
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onChangePage={handlePageChange}
                />
            </Container>
        </>
    )
}
export default MyLikes