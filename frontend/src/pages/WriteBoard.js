import React, {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import axios from 'axios';
import NoImage from 'assets/no_img.png';
import cocktail from 'assets/cocktail.gif';
import CustomTextareaAutosize2 from 'components/CustomTextareaAutosize2';
import AddIngredient from "components/WriteBoard/AddIngredient";
import Ingredients from "components/WriteBoard/Ingredients";
import {
    Button,
    TextField,
    Paper,
    Typography,
    Box,
    TextareaAutosize,
    IconButton,
    Grid,
    Container,
    Avatar
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import koalaImage from '../assets/profile.jpg'
import {array} from "yup";
import {useNavigate} from "react-router-dom";

function BulletinBoard() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [imagePreview, setImagePreview] = useState(cocktail);
    const nickname = useSelector(state => state.auth.user?.nickname);
    const [cocktails, setCocktails] = useState([]);
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [imgUrl, setImgUrl] = useState('')
    const [fileInfo, setFileInfo] = useState({id: null, fileDownloadUri: ''});

    const navigate = useNavigate();

    // 전부 입력되었는지 확인하기 위한 변수
    const isFormValid = title && content && cocktails.length > 0 && selectedImageFile;

    // 인증 헤더를 가져오는 함수
    const getAuthHeader = () => {
        const authHeader = localStorage.getItem('authHeader');
        return authHeader ? {Authorization: authHeader} : {};
    };

    // 컴포넌트 마운트 시 사용자 ID 가져오기
    useEffect(() => {
        getAuthHeader();
    }, []);


    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // 이미지 파일인지 확인
            if (!file.type.startsWith('image/')) {
                alert('이미지 파일만 업로드할 수 있습니다.');
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };

            // 이미지 파일을 상태로 업데이트
            setSelectedImageFile(file);
        }
    };

    const handleCancelImage = () => {
        setImagePreview(cocktail);
    };

    const saveRecipeImage = async (e) => {
        e.preventDefault()
        try {
            // 이미지 파일이 선택되지 않았을 경우 예외처리
            if (!selectedImageFile) {
                console.error("이미지 파일이 선택되지 않았습니다.");
                return;
            }

            // FormData 객체를 생성하여 이미지 파일을 담음
            const formData = new FormData();
            formData.append("file", selectedImageFile);
            formData.append("type", "board");

            // Axios를 사용하여 이미지를 업로드하는 요청 보냄
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/board/upload`,
                formData,
                "board",
                {
                    headers: getAuthHeader()
                });

            // 이미지 업로드 완료 후 URL과 메타데이터 id를 반환
            return response.data;

        } catch (error) {
            console.error("이미지 업로드에 실패했습니다.", error);
            throw error; // 에러를 다시 던져서 호출한 곳에서 처리할 수 있도록 함
        }
    };

    // 게시글 저장 함수, 이제 imageUrl을 인자로 받음
    const saveRecipe = async (fileResult) => {
        //    console.log("saveRecipe");
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/board/write`, {
                    nickname: nickname,
                    title: title,
                    content: content,
                    cocktails: cocktails,
                    image: fileResult.fileDownloadUri, // 인자로 받은 이미지 URL 사용
                    fileId: fileResult.id,
                },
                {
                    headers: getAuthHeader()
                });

            //      console.log('게시글 작성 완료: ', response.data);
        } catch (error) {
            console.error('게시글 작성 중 오류 발생: ', error);
            throw error; // 에러를 다시 던져서 호출한 곳에서 처리할 수 있도록 함
        }
    };

    // 이미지 업로드 및 게시글 저장을 담당하는 함수
    const handleSubmit = async (e) => {
        e.preventDefault(); // 폼 제출 기본 동작 방지
        // 폼 유효성 검사 추가
        if (!isFormValid) {
            alert('모든 필드를 채워주세요.');
            return;
        }
        try {
            const fileResult = await saveRecipeImage(e); // 이미지 업로드 완료까지 기다림
            setFileInfo({
                id: fileResult.id,
                fileDownloadUri: fileResult.fileDownloadUri,
            });
            await saveRecipe(fileResult); // 업로드된 이미지 URL을 가지고 게시글 저장
            alert('레시피가 성공적으로 저장되었습니다😊');
            navigate(`/recipe`);

            // 입력 필드와 이미지 미리보기를 초기화
            setTitle(''); // 제목 초기화
            setContent(''); // 내용 초기화
            setCocktails([]); // 재료 목록 초기화
            setImagePreview(cocktail); // 이미지 미리보기 초기화
            setSelectedImageFile(null); // 선택된 이미지 파일 초기화
        } catch (error) {
            console.error('게시글 작성 중 오류 발생: ', error);
        }
    };

    const handleDeleteIngredient = (index) => {
        setCocktails((prevCocktails) => prevCocktails.filter((_, i) => i !== index));
    };


    return (
        <Container>
            <Paper elevation={3}
                   sx={{margin: '20px', padding: 5, boxShadow: 3, backgroundColor: 'white', borderRadius: '15px'}}>
                <Box display={'flex'} sx={{gap: 7, padding: 2}}>
                    <Avatar sx={{width: 200, height: 200}} src={koalaImage}/>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        textAlign: 'left',
                        gap: 1
                    }} ml={5}>
                        <Typography variant="h5">나만의 레시피 올리기</Typography>
                        <Typography variant="body3">나만의 시크릿 레시피를 마음껏 뽐내보세요!</Typography>
                        <Box mt={2}>
                            <Typography variant="body2" mb={1}>나만 혼자 알고 있기 아쉬운 칵테일 레시피가 있으신가요? 🍸</Typography>
                            <Typography variant="body2" mb={1}>우리 코알라 친구들에게 나만의 시크릿 레시피를 공유해주세요 😃</Typography>
                            <Typography variant="body2">코알라 메이트는 여러분이 함께 만들어가는 사이트입니다.</Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>

            <Box component="form" noValidate autoComplete="off" mt={3}>
                <Paper elevation={3}
                       sx={{margin: '20px', padding: 5, boxShadow: 3, backgroundColor: 'white', borderRadius: '15px'}}>
                    <Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>

                        {/*이미지 업로드*/}
                        <Box>
                            <Typography variant="h5">칵테일 사진 📷</Typography>
                            <Box sx={{display: 'flex', gap: 6}}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    width: '100%',
                                    maxWidth: '400px',
                                    padding: 2,
                                }}>
                                    <Box>
                                        <img src={imagePreview} alt="Preview" style={{
                                            width: '100%',
                                            height: 'auto',
                                            borderRadius: '10px',
                                            border: '1px solid #eee',
                                        }}/>
                                    </Box>

                                    <Box sx={{
                                        display: 'flex',
                                        gap: 1,
                                        alignItems: 'center', // 아이템을 세로축 중앙에 배치
                                    }}>
                                        <Button
                                            variant="contained"
                                            component="label"
                                            sx={{flexGrow: 1}} // 버튼이 가능한 많은 공간을 차지하도록 설정
                                        >
                                            이미지 업로드
                                            <input type="file" hidden onChange={handleImageChange} accept="image/*"/>
                                        </Button>
                                        {imagePreview !== cocktail && (
                                            <IconButton
                                                aria-label="delete"
                                                sx={{
                                                    color: 'grey[900]',
                                                    backgroundColor: 'lightgrey',
                                                    borderRadius: '4px',
                                                }}
                                                onClick={handleCancelImage}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        )}
                                    </Box>

                                </Box>
                                <Box mt={2}
                                     sx={{display: 'flex', flexDirection: 'column', justifyContent: "center", gap: 3}}>
                                    <Box>
                                        <Typography variant="body3" mb={1}>추천 사진 1</Typography>
                                        <Typography variant="body2" mb={1}>깔끔한 흰 배경에서 찰칵!</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body3" mb={1}>추천 사진 2</Typography>
                                        <Typography variant="body2" mb={1}>어두운 곳에서 핸드폰 플래시로 반짝거리게 찰칵!</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="body3" mb={1}>추천 사진 3</Typography>
                                        <Typography variant="body2" mb={1}>칵테일 재료들을 배경으로 화려하게 찰칵!</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        {/*칵테일 이름*/}
                        <Box>
                            <Typography variant="h5" mb={1}>칵테일 이름 🍹</Typography>
                            <TextField label="칵테일 이름"
                                       variant="outlined"
                                       fullWidth
                                       value={title}
                                       onChange={handleTitleChange}
                                       sx={{paddingY: '10px', margin: '10px', marginTop: 0}}
                                       placeholder="칵테일 이름을 지어주세요 : )"
                            />
                        </Box>

                        {/*재료 정보*/}
                        <Box>
                            <Typography variant="h5" mb={2}>재료 정보 🍋</Typography>
                            <AddIngredient updateCocktails={setCocktails}/>
                            <Ingredients cocktails={cocktails} onDeleteIngredient={handleDeleteIngredient}/>
                        </Box>

                        {/*레시피 설명*/}
                        <Box>
                            <Typography variant="h5">레시피 설명 📄</Typography>
                            <CustomTextareaAutosize2
                                sx={{margin: '20px', padding: '20px'}}
                                minRows={12}
                                placeholder="레시피에 대한 설명을 적어주세요 : )"
                                value={content}
                                onChange={handleContentChange}
                            />
                        </Box>
                    </Box>

                    {/*레시피 저장 버튼*/}
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                    >
                        레시피 올리기
                    </Button>
                </Paper>
            </Box>
        </Container>
    );
}

export default BulletinBoard;
