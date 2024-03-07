import React, {useEffect, useState} from 'react'
import style from "../components/RecipeBoard/RecipeList.module.css";
import RecipeItem from "../components/RecipeBoard/RecipeItem";
import PaginationComponent from "../components/PaginationComponent";
import SearchResultBtn from "../components/Search/SearchResultBtn";
import axios from "axios";
import IngredientItem from "../components/IngredientItem";
import {Alert, Container, Stack} from '@mui/material'

const SearchResult = ({term}) => {
    const [likedRecipes, setLikedRecipes] = useState([]);

    const sizeNum = 8
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [optionNum, setOptionNum] = useState(1)

    const [recipeData, setRecipeData] = useState([])
    const [drinkData, setDrinkData] = useState([])
    const [ingredientData, setIngredientData] = useState([])

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };
    const toggleLikedState = async (boardId) => {
        const isLiked = likedRecipes.includes(boardId);
        const newLikedRecipes = isLiked ? likedRecipes.filter(id => id !== boardId) : [...likedRecipes, boardId];
        setLikedRecipes(newLikedRecipes);
    };

    const getSearchRecipe = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/board/searchForFront?page=${currentPage}&size=${sizeNum}&keyword=${term}&option=${optionNum}`, { headers: {'Authorization': localStorage.getItem('authHeader')}})
            const data = response.data.content
            setTotalPages(response.data.totalPages)     // 총 페이지 수
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
            console.error("검색 결과(레시피) 가지고 오던 중 에러 발생: ", error)
        }
    }

    const getSearchIngredient = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/drink/search?name=${term}`)
            const data = response.data
            setIngredientData(data.map(item => ({
                id: item.id,
                name: item.name,
                category: item.category,
                imageUrl: item.image,
                recipe: item.cocktails,
            })))
        } catch (error) {
            console.error("검색 결과(재료) 가지고 오던 중 에러 발생: ", error)
        }
    }


    useEffect(() => {
        if (optionNum !== 4) {
            getSearchRecipe();
        } else {
            getSearchIngredient();
        }
    }, [currentPage, optionNum, term]);


    return (
        <Container
            sx={{
                display: 'flex', // Flexbox container로 설정
                flexDirection: 'column', // 자식 요소들을 세로로 정렬
                alignItems: 'center', // 수평 가운데 정렬
                minHeight: '100vh', // 최소 높이를 화면 높이의 100%로 설정 (전체 화면에서 중앙 정렬을 위해)
            }}
        >
            <h3>검색 결과</h3>
            <SearchResultBtn setOptionNum={setOptionNum}/>
            {optionNum !== 4 ? (
                recipeData.length > 0 ? (
                    <>
                        <div className={style.cardList}>
                            {recipeData.map(result => (
                                <RecipeItem
                                    key={result.boardId}
                                    boardId={result.boardId}
                                    imageUrl={result.imageUrl}
                                    title={result.title}
                                    author={result.author}
                                    tags={[]}
                                    liked={result.liked}
                                    toggleLiked={() => toggleLikedState(result.boardId)}
                                />
                            ))}
                        </div>
                        <PaginationComponent
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onChangePage={handlePageChange}
                        />
                    </>
                ) : (
                    <Stack sx={{width: '100%', maxWidth: 360, m: 3}} spacing={2}>
                        <Alert severity="error"
                               sx={{
                                   backgroundColor: '#eeeeee', // 배경색 변경
                                   borderRadius: 3,
                               }}
                        >검색 결과가 없습니다.</Alert>
                    </Stack>
                )
            ) : (
                ingredientData.length > 0 ? (
                    <div className={style.cardList}>
                        {ingredientData.map(result => (
                            <IngredientItem
                                key={result.id}
                                ingredientId={result.id}
                                imageUrl={result.imageUrl}
                                name={result.name}
                                idx={result.category}
                            />
                        ))}
                    </div>
                ) : (
                    <Stack sx={{width: '100%', maxWidth: 360, m: 3}} spacing={2}>
                        <Alert severity="error"
                               sx={{
                                   backgroundColor: '#eeeeee', // 배경색 변경
                                   borderRadius: 3,
                               }}
                        >검색 결과가 없습니다.</Alert>
                    </Stack>
                )
            )}
        </Container>
    );
}
export default SearchResult

