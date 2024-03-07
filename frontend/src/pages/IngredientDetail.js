import React, {useEffect, useState} from 'react'
import {useParams} from "react-router-dom";
import axios from "axios";
import Recommend from "../components/Recommend";
import {Typography, Box, Grid, Chip} from "@mui/material";
import Paper from "@mui/material/Paper";

const IngredientDetail = () => {
    // 인증 헤더를 가져오는 함수
    const getAuthHeader = () => {
        const authHeader = localStorage.getItem('authHeader');
        return authHeader ? {Authorization: authHeader} : {};
    };
    const {ingredientId} = useParams();
    const categories = [
        // '무알콜',
        '기타 재료',
        '진',
        '럼',
        '보드카',
        '위스키',
        '데킬라',
        '브랜디',
        '리큐르',
        '맥주',
        '소주',
    ];

    const [ingredient, setIngredient] = useState({
        id: 0,
        name: "",
        category: 0,
        imageUrl: "",
        label: "",
        cocktails: [],
    })

    const [cocktailData, setCocktailData] = useState([])

    const getIngredientData = async () => {
        try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/drink/${ingredientId}`,
            {
                headers: getAuthHeader(), // 인증 헤더 추가
            })
        const data = response.data
        setIngredient({
            id: data.id,
            name: data.name,
            category: data.category,
            imageUrl: data.image,
            label: data.label,
        })

            // cocktails 데이터가 비어있으면 빈 배열을 설정
            const cocktails = data.cocktails || [];
            setCocktailData(cocktails.map(item => ({
                boardId: item.board.id,
                title: item.board.title,
                content: item.board.content,
                date: item.board.date,
                author: item.board.nickname,
                imageUrl: item.board.image,
                liked: item.board.like // 여기가 올바르게 작동해야 함
            })));

        } catch (error) {
            console.error('재료 데이터 가져오는 중 에러 발생 :',  error)
        }
    }


    useEffect(() => {
        getIngredientData()

    }, [ingredientId]);


    // 진짜
    const img = `${ingredient.imageUrl}`
    const type = categories[ingredient.category]

    // 테스트용
    // const img = `${process.env.REACT_APP_IMAGE_URL}/ingredientImage/orange2.jpg`
    // const img = `${process.env.REACT_APP_IMAGE_URL}/ingredientImage/orange.png`


    return (
    <div>
        <Paper sx={{margin: '20px', padding: '20px', backgroundColor: 'white', borderRadius: '15px'}} elevation={3}>
            <Grid container spacing={5} justifyContent="center" display="flex" flexDirection="row">
                <Grid item xs={12} sm={6}>
                    <Box
                        display="flex"
                        justifyContent="flex-end" // 이미지를 오른쪽으로 이동
                        sx={{
                            width: '100%',
                            paddingRight: '20%',
                        }}
                    >
                        <Box
                            component="img"
                            src={img}
                            sx={{
                                width: '70%',
                                height: 'auto',
                                objectFit: 'contain',
                                maxHeight: 600,
                                borderRadius: '15px', // 모서리를 둥글게 처리
                            }}
                        />
                    </Box>
                </Grid>
                {/*<hr/>*/}
                <Grid item xs={12} sm={6}>
                    <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%" gap={1}>
                        <div>
                            <Typography variant="h5" color="#FF9B9B" sx={{mt: 2, mb:1}}>{ingredient.name}</Typography>
                            <Chip label={`# ${type}`}/>
                        </div>
                    </Box>

                </Grid>
            </Grid>
        </Paper>

        <Recommend cocktails={cocktailData}/>
    </div>
);
}
export default IngredientDetail;