import React, {useState, useRef} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {TextField, Button, Box, Typography, Grid} from '@mui/material';
import {useSelector} from 'react-redux';

const CommentForm = ({boardId, updateComments}) => {
    // 로그인한 사용자 정보 가져오기
    const {user, isLoggedIn} = useSelector(state => state.auth);

    let userNickname = ''
    if (isLoggedIn) {
        userNickname = user.nickname; // user가 null인 경우를 처리
    }

    const commentInput = useRef();
    const navigate = useNavigate(); // useNavigate 초기화

    const [commentData, setCommentData] = useState({
        nickname: userNickname,
        content: '',
        date: ''
    });

    // 만약 로그인하지 않았다면, 로그인 페이지로 이동
    const isNotLoggin = () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
    }


    const handleAddComment = async () => {
        // 댓글 내용이 비어 있다면 입력란에 포커스
        if (commentData.content.trim().length < 1) {
            commentInput.current.focus();
            return;
        }

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/comment/${boardId}/write`, {
                    board_id: Number(boardId),
                    nickname: commentData.nickname,
                    content: commentData.content,
                    date: commentData.date
                }, {withCredentials: true});

    //        console.log('댓글 추가 완료 : ', response.data);

            updateComments(); // 댓글 추가 후 댓글 목록 갱신
            setCommentData({
                nickname: userNickname,
                content: '',
                date: ''
            });
        } catch (error) {
            console.error('댓글 추가 중 오류 발생 : ', error);
        }
    };

    // 엔터 키 이벤트 핸들러
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 기본 이벤트를 방지하여 줄바꿈이 일어나지 않도록 합니다.
            handleAddComment();
        }
    };


    return (
        <Box
            mt={3}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
            }}
        >
            {isLoggedIn ? (
                <>
                    <Typography variant="h6" sx={{width: 'auto', flexShrink: 0, fontWeight: 'bold'}}>{commentData.nickname}</Typography>
                    <Box display={'flex'} flexGrow={1} width={'100%'}>
                        <TextField
                            inputRef={commentInput}
                            // label="댓글 내용"
                            placeholder="칭찬과 격려의 댓글은 작성자에게 큰 힘이 됩니다 :)"
                            inputProps={{maxLength: 200}}
                            value={commentData.content}
                            onChange={(e) => setCommentData({...commentData, content: e.target.value})}
                            multiline
                            rows={1}
                            fullWidth
                            sx={{flexGrow: 1, marginRight: '8px'}}
                            onKeyPress={handleKeyPress}
                        />
                        <Button
                            onClick={handleAddComment}
                            variant="contained"
                            sx={{
                                borderRadius: '10px',
                                height: '56px',
                                fontWeight: 'bold'
                            }}
                        >
                            입력
                        </Button>
                    </Box>
                </>
            ) : (
                <Typography
                    onClick={isNotLoggin}
                    sx={{
                        cursor: 'pointer',
                        color: '#888',
                        flexGrow: 1,
                        textAlign: 'center',
                    }}
                >
                    로그인 후 댓글을 입력해주세요 :)
                </Typography>
            )}
        </Box>
    );
};

export default CommentForm;
