import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Avatar, Typography, Box, Chip, Button} from '@mui/material';
import Brightness1Icon from '@mui/icons-material/Brightness1'; // Import the correct icon
import FollowMiniBox from "../Follow/FollowMiniBox";
import FollowBtn from "../Follow/FollowBtn";
import GenderBirthRange from "../GenderBirthRange";

const standardImgPath = '/assets/profile.jpg';

const Profile = ({img, nickname, gender, age, follower, followee, userId}) => {
  //  console.log(img)

    // 로그인한 사용자 정보 가져오기
    const {user, isLoggedIn} = useSelector(state => state.auth);
    let userNickname = ''
    if (isLoggedIn) {
        userNickname = user.nickname; // user가 null인 경우를 처리
    }

    const profileImage = img ? `${img}` : '/assets/profile.jpg';

    // const profileImage = img || '/assets/profile.jpg'
    const followerCnt = follower.cnt;
    const followeeCnt = followee.cnt;

    return (
        <>
            <Box
                m={3}
                sx={{
                    width: 300,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >

                <Avatar sx={{width: 200, height: 200}} src={profileImage}/>


                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '20px',
                }}>
                    <Brightness1Icon sx={{
                        marginRight: '5px',
                        width: 10,
                        height: 10,
                        color: '#00a152',
                    }}/>
                    {/*<Typography variant="h5">{userNickname}</Typography>*/}
                    <Typography sx={{fontWeight: 'bold'}}
                                variant="h5">{nickname}</Typography>
                </div>

                {/*<div style={{display: 'flex', marginTop: '10px', gap: 10}}>*/}
                {/*    <Chip label={`${age}대`} variant="Filled"*/}
                {/*          sx={{backgroundColor: '#CDFAD5'}}/>*/}
                {/*    <Chip label={gender} variant="Filled"*/}
                {/*          sx={{backgroundColor: '#FF9B9B'}}/>*/}
                {/*</div>*/}

                <GenderBirthRange gender={gender} birthRange={age} />
                {nickname === userNickname ?
                    <FollowMiniBox userId={userId} followerCnt={followerCnt} followeeCnt={followeeCnt}/> :
                    <FollowBtn targetUserId={userId}/>
                }
            </Box>
        </>
    )
        ;
};

export default Profile;
