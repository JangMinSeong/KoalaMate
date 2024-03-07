import React, {useState} from 'react';
import {ListItem, Typography, Button, Grid, TextField, Box, IconButton, Tooltip } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import {useSelector} from 'react-redux';
import {format} from "date-fns";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CommentItem = ({comment, onDeleteComment, onEditComment, handleEditComment}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editedContent, setEditedContent] = useState(comment.content)


    // 현재 로그인한 사용자가 댓글 작성자인지 확인하는 부분
    const isCommentAuthor = useSelector(state => state.auth.user?.nickname === comment.nickname);

    // 수정
    const handleEditClick = () => {
        setIsEditing(true)
        onEditComment(comment.id, editedContent);  // 수정 중인 댓글의 ID와 내용 전달
    }

    // 수정 저장
    const handleSaveClick = () => {
        onEditComment(comment.id, editedContent) // 수정된 내용으로 바꾸기
        setIsEditing(false)                // 수정 상태에서 나가기
    }

    // 엔터 키로 저장 기능
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            handleSaveClick();
            e.preventDefault();
        }
    };

    // 수정 취소
    const handleCancelClick = () => {
        setIsEditing(false)            // 수정 상태에서 나가기
        setEditedContent(comment.content)    // 원래 댓글로 초기화
    }

    return (
        <ListItem sx={{margin: '10px', padding: '10px', display: 'flex', justifyContent: 'space-between'}}>
            <Grid container spacing={2}>
                <Grid item xs={8}>
                    {isEditing ? (
                        <TextField
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            fullWidth
                            multiline
                            rows={1} // CommentForm의 높이에 맞춰 조정
                            onKeyPress={handleKeyPress} // 엔터 키로 저장
                        />
                    ) : (
                        <>
                            <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>
                                {comment.nickname}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '5px'}}>
                                {comment.content}
                            </Typography>
                            <Typography variant="body2" sx={{color: '#888'}}>
                                {format(new Date(comment.date), 'yyyy년 MM월 dd일 HH:mm:ss')}
                            </Typography>

                        </>
                    )}
                </Grid>
                <Grid item xs={4} sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start'}}>
                    {isEditing ? (
                        <>
                            <Tooltip title="수정 취소">
                                <IconButton
                                    onClick={handleCancelClick}
                                    startIcon={<CancelIcon/>}
                                    sx={{
                                        marginTop: '10px',
                                    }}
                                >
                                    <CancelIcon/>
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="저장">
                                <IconButton
                                    onClick={handleSaveClick}
                                    startIcon={<SaveIcon/>}
                                    sx={{
                                        marginTop: '10px',
                                    }}
                                >
                                    <SaveIcon/>
                                </IconButton>
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            {isCommentAuthor && (
                                <>
                                    <Tooltip title="댓글 수정">
                                        <IconButton
                                            onClick={() => handleEditClick(comment.id, editedContent)}
                                            sx={{
                                                marginTop: '10px',
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="댓글 삭제">
                                        <IconButton
                                            onClick={() => onDeleteComment(comment.id)}
                                            sx={{marginTop: '10px'}}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>

                                </>
                            )}
                        </>
                    )}
                </Grid>
            </Grid>
        </ListItem>
    );
};

export default CommentItem;
