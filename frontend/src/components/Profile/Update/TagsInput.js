// TagsInput.js
import React from 'react';
import {Box, Chip, TextField, Button, Typography} from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CancelIcon from '@mui/icons-material/Cancel';
import DoneIcon from '@mui/icons-material/Done';

// 기본 태그 리스트
const defaultTags = [
    "1~2명", "3~5명", "6~8명", "8~10명",
    "20대", "30대", "40대", "50대", "60대 이상",
    "직장인", "학생", "취준생", "주부", "홈 프로텍터",
    "남자만", "여자만", "남녀 모두",
];

const TagsInput = ({
                       tagOptions,
                       selectedTags,
                       handleTagClick,
                       isVisible,
                       toggleVisibility,
                       addTagOptions,
                       addTag,
                       setAddTag,
                       error,
                       handleRemoveTag
                   }) => {
    const renderTags = () => {
        return (
            <Box sx={{
                display: 'flex',
                gap: 1,
                marginTop: 1,
                flexWrap: 'wrap',
            }}>
                {tagOptions.map((tag) => (
                    <Box key={tag} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Chip
                            label={tag}
                            variant="filled"
                            onClick={() => handleTagClick(tag)}
                            icon={selectedTags.includes(tag) ? <DoneIcon /> : null}
                            sx={{
                                mr: 1,
                                mb: 1,
                                // backgroundColor: selectedTags.includes(tag)
                                //     ? '#ff9b9b'
                                //     : undefined,
                                // color: selectedTags.includes(tag) ? '#fff' : undefined,
                            }}
                            color={selectedTags.includes(tag) ? "success" : "default"}
                        />
                        {!defaultTags.includes(tag) && (
                            <CancelIcon
                                onClick={() => handleRemoveTag(tag)}
                                sx={{ cursor: 'pointer', color: 'grey', ml: 0.5 }}
                            />
                        )}
                    </Box>
                ))}
            </Box>
        );
    };

    return (
        <Box>
            <Typography
                mt={3}
                mb={2}
                sx={{fontWeight: 'bold'}}
                variant="h6"
            >
                선호하는 모임 태그 선택하기
            </Typography>
            <Box sx={{
                display: 'flex',
                gap: 1,
                marginTop: 1,
            }}>{renderTags()}</Box>

            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
            }}>
                <Button onClick={toggleVisibility}>
                    <AddBoxIcon sx={{fontSize: '50px', color: '#ff9b9b'}}/>
                </Button>
                {isVisible && (
                    <Box>
                        <TextField
                            sx={{marginTop: 2, width: 600}}
                            label="태그 추가하기"
                            placeholder="추가하고 싶은 모임 태그를 작성해주세요"
                            value={addTag}
                            onChange={(e) => setAddTag(e.target.value)}
                        />
                        <Button onClick={addTagOptions}
                                sx={{
                                    marginTop: 2,
                                    backgroundColor: '#ff9b9b',
                                    color: 'white',
                                    fontWeight: 'bold',
                                    borderRadius: '5px',
                                    padding: '15px',
                                    '&:hover': {
                                        backgroundColor: '#ff7f7f',
                                    },
                                }}
                        >추가</Button>
                        {error && (
                            <Typography
                                sx={{color: 'red', marginTop: 1}}
                                variant="body2"
                            >
                                {error}
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default TagsInput;
