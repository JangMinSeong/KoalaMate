import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from "axios";
import CommentList from "components/Comment/CommentList";
import style from "../components/RecipeBoard/RecipeItem.module.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import {
    Typography,
    Box,
    Button,
    ListItem,
    ListItemText,
    List,
    ListItemAvatar,
    Avatar,
    Grid,
    Chip,
    Container
} from "@mui/material";
import {format} from 'date-fns';
import Paper from '@mui/material/Paper';
import {useSelector} from "react-redux";
import {Link} from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import placeHolder from 'assets/no_img.png'


const RecipeDetail = () => {
    const navigate = useNavigate();

    
    // 로그인한 사용자 정보 가져오기
    const {user, isLoggedIn} = useSelector(state => state.auth);
    const currentUserNickname = user?.nickname;
  //  console.log('로그인한 사용자 닉네임: ', currentUserNickname)

    const {boardId} = useParams(); // URL 파라미터에서 boardId 추출
    const [recipe, setRecipe] = useState({
        id: 0,
        title: "",
        content: "",
        date: "",
        views: 0,
        nickname: "",
        image: '',
        comments: [],
        likeCount: 0,
        liked: false,
        ingredients: []
    });

    // 좋아요 상태를 추적하기 위한 상태 변수와 setter 함수
    const [isLiked, setIsLiked] = useState(false);
    const authHeader = localStorage.getItem('authHeader');

    const [isLoading, setIsLoading] = useState(true);

    const handleLikeClick = async (e) => {
        e.stopPropagation();

        if (!isLoggedIn) {
            alert('좋아요를 누르려면 로그인을 하셔야 합니다. 로그인 해주세요.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/board/like`, {
                id: boardId,
                like: !isLiked
            }, {
                headers: {'Authorization': authHeader}
            });
            if (response.status === 200) {
                setIsLiked(!isLiked);
            } else {
                // 실패 응답 처리
                console.error('좋아요 변경 실패:', response);
            }
        } catch (error) {
            console.error('좋아요 상태를 변경하는 중 에러 발생:', error);
        }
    };

    const getDetailRecipe = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/board/view?id=${boardId}`, {headers: {'Authorization': authHeader}});
            const data = response.data;
   //         console.log(data);
            setRecipe({
                id: data.id,
                title: data.title,
                content: data.content,
                date: format(new Date(data.date), 'yyyy년 MM월 dd일 HH:mm:ss'),
                views: data.views,
                image: `${data.image}`,
                nickname: data.nickname,
                comments: data.comments || [],
                likeCount: data.likeCount,
                liked: data.liked,
                ingredients: data.cocktails || [],
            });
            setIsLiked(data.liked);

        } catch (error) {
            console.error('레시피 상세 정보를 가져오는 중 에러 발생: ', error);
        }
    };

    useEffect(() => {
        getDetailRecipe();
    }, [boardId]);

    const handleDelete = async () => {
        if(window.confirm('이 레시피를 정말 삭제하시겠습니까?')) {
            try {
                const response = await axios.delete(`${process.env.REACT_APP_API_URL}/board/delete/${boardId}`, {
                    headers: {'Authorization': authHeader}
                });
                if (response.status === 200) {
                    alert('레시피가 성공적으로 삭제되었습니다.');
                    navigate(`/recipe`);
                } else {
                    console.error('삭제 실패:', response);
                }
            } catch (error) {
                console.error('레시피 삭제 중 에러 발생:', error);
            }
        }
    }

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

    return (
        <div>
            <Box sx={{display:'flex', justifyContent:'space-between'}}>
                {/*<Chip label={`#${recipe.id}번째 레시피`} />*/}
                <Typography variant="h5" color="#FF9B9B" sx={{ mb: 2 }}>레시피 상세</Typography>
                {user &&  (recipe.nickname === currentUserNickname || currentUserNickname === 'admin') && (
                    <Button
                        variant="contained"
                        sx={{ marginRight:3, paddingRight:1}}
                        onClick={handleDelete}
                    >
                        레시피 삭제
                        <DeleteIcon />
                    </Button>
                )}
            </Box>
            <Paper sx={{ margin: '20px', padding: '30px', backgroundColor: 'white', borderRadius: '15px'}} elevation={3}>
                <Grid container justifyContent="center" display="flex-wrap" flexDirection="row" spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <Box sx={{ width: '300px', height: '400px', borderRadius: '15px', overflow: 'hidden' }}>
                            {isLoading && (
                              // 이미지 로딩 중에 표시할 플레이스홀더 이미지
                              <Box component="img" src={placeHolder} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            )}
                            <Box
                              component="img"
                              src={recipe.image}
                              sx={{ width: '100%', height: '100%', objectFit: 'cover', display: isLoading ? 'none' : 'block' }}
                              onLoad={() => setIsLoading(false)} // 이미지 로딩 완료 시 isLoading 상태를 false로 설정
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box display="flex" flexDirection="column" height="100%">
                            <Box>
                                <Typography variant="h6" sx={{ mb: 2 }}>{`#${recipe.id}번째 레시피`}</Typography>
                                <Typography variant="h5" color="#FF9B9B" sx={{ mt: 2, mb: 3 }}>{recipe.title}</Typography>
                                <Typography variant="h5" color='gray' sx={{ mb: 1 }}>By {recipe.nickname === 'admin' ? '레시피 백과' : recipe.nickname}</Typography>
                                <Typography color='gray' sx={{ mb: 2 }}>작성일: {recipe.date}</Typography>
                                <Typography color='#FF9B9B' sx={{ mt: 4, mb: 1}}>레시피 설명</Typography>
                                <Box sx={{ m:1, p: 2, border: '1px solid #FF9B9B', borderRadius: '15px', whiteSpace: 'pre-wrap'}}>{recipe.content}</Box>

                                <Button onClick={handleLikeClick}>
                                    {isLiked ? (
                                        <FavoriteIcon sx={{fontSize: '2rem', color: '#FF9B9B'}}/>
                                    ) : (
                                        <FavoriteTwoToneIcon sx={{fontSize: '2rem', color: '#e9e9e9'}}/>
                                    )}
                                </Button>
                            </Box>
                        </Box>

                    </Grid>
                </Grid>
            </Paper>

            <Typography variant="h5" color="#FF9B9B" sx={{ mt: 7, mb: 1 }}>재료 정보</Typography>
            <Paper elevation={3} sx={{ margin: '20px', padding: '40px', boxShadow: 3, backgroundColor: 'white', borderRadius: '15px'}}>
                <List>
                    {recipe.ingredients.map((ingredient, index) => (
                        <Link to={`/ingredient/${ingredient.drink.id}`} key={index}
                              style={{textDecoration: 'none', color: 'inherit'}}>
                            <ListItem key={index}
                                      sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <ListItemAvatar>
                                    <Avatar src={ingredient.drink.image} alt={ingredient.drink.name}
                                            sx={{width: 56, height: 56, margin: '0 20px', bgcolor: '#FF9B9B'}}/>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={ingredient.drink.name}
                                    secondary={`카테고리: ${categories[ingredient.drink.category]}`}
                                    sx={{margin: '0 16px', flex: '1 1 auto'}}
                                />
                                <Typography variant="body2" sx={{minWidth: '50px', textAlign: 'right'}}>
                                    {`${ingredient.proportion} ${ingredient.unit}`}
                                </Typography>
                            </ListItem>
                        </Link>
                    ))}
                </List>
            </Paper>

            <CommentList/>
        </div>
    );
}


export default RecipeDetail;
