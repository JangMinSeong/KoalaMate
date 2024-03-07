// ProfileImageUploader.js
import React from 'react';
import {Avatar, Button, IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";

const ProfileImageUploader = ({userId, imagePreview, handleImageChange, handleCancelImage, selectedImageFile, saveProfileImage}) => {
    const handleSaveProfileImage = () => {
        // 전달된 prop으로 받은 saveProfileImage 함수 호출
        saveProfileImage();
    };
    return (
        <>
            <Avatar
                sx={{width: 200, height: 200, borderRadius: '50%', mb: 1}}
                src={imagePreview}
                alt="프로필 사진"
            />
            <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                <Button sx={{backgroundColor: '#ff9b9b'}} variant="contained" component="label" fullWidth>
                    프로필 이미지 변경
                    <input type="file" hidden onChange={(e) => {
                        handleImageChange(e);
                        selectedImageFile = e.target.files[0];
                    }} accept="image/*"/>
                </Button>
                {imagePreview && (
                    <IconButton
                        aria-label="delete"
                        sx={{
                            color: 'grey[900]',
                            backgroundColor: 'lightgrey',
                            borderRadius: '4px',
                            margin: '0 4px 4px 0',
                        }}
                        onClick={handleCancelImage}
                    >
                        <DeleteIcon/>
                    </IconButton>
                )}
                {/*<Button onClick={handleSaveProfileImage}>완료</Button>*/}
            </div>
        </>
    );
};

export default ProfileImageUploader;
