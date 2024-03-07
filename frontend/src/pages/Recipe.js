import React, {useState} from 'react';
import RecipeFilter from 'components/RecipeBoard/RecipeFilter';
import RecipeList from 'components/RecipeBoard/RecipeList';
import RecipeItem from 'components/RecipeBoard/RecipeItem';
import Searchbar from '../components/RecipeBoard/Searchbar';
import PopularRecipes from '../components/RecipeBoard/PopularRecipes';
import style from 'pages/Recipe.module.css';
import RecipeButton from 'components/RecipeBoard/RecipeButton';
import SearchResult from './SearchResult';
import {Box} from "@mui/material";


const Recipe = () => {
    // 옵션 숫자 1: 전체 레시피 조회, 2: 관리자(admin) 레시피 조회, 3: 유저 레시피 조회
    const [optionNum, setOptionNum] = useState(1)
    const [minNum, setMinNum] = useState(1)
    const [maxNum, setMaxNum] = useState(30)

    // 검색 결과 저장
    const [searchResults, setSearchResults] = useState([]);
    const [totalPages, setTotalPages] = useState(0);


    const [category, setCategory] = useState(null);

    const [term, setTerm] = useState('');
    const [isSearch, setIsSearch] = useState(false)

    const handleSearchResults = (result, pages) => {
        setSearchResults(result);     // 검색 결과를 저장
        setTotalPages(pages);
        setIsSearch(true);      // 검색이 수행되었음을 표시
    };

    const handleCategoryChange = (selectedCategory) => {
        setCategory(selectedCategory);
    };

    return (
        <Box>
            <h1>레시피 조회 페이지</h1>
            {isSearch ?
                <div className={style.topContainer2}>
                    <Searchbar setIsSearch={setIsSearch} setTerm={setTerm} term={term}/>
                </div>
                :
                <div className={style.topContainer}>
                    <RecipeButton setOptionNum={setOptionNum}/>
                    <Searchbar setIsSearch={setIsSearch} setTerm={setTerm} term={term}/>
                </div>
            }
            <hr/>
            <PopularRecipes/>

            {isSearch ?
                <SearchResult term={term}/> :
                <>
                    <RecipeFilter onCategoryChange={handleCategoryChange} setMinNum={setMinNum} setMaxNum={setMaxNum}/>
                    <RecipeList optionNum={optionNum} category={category} minNum={minNum} maxNum={maxNum}/>
                </>
            }
        </Box>

    );
};

export default Recipe;