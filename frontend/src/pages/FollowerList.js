import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import MyPageButton from '../components/Profile/MyPageButton';
import FollowItem from '../components/Follow/FollowItem';
import {Box, Typography} from '@mui/material';

const FollowerList = () => {
    const {userId} = useParams();

    const [followerData, setFollowerData] = useState({
        cnt: 0,
        list: [],
        user: '',
        id: 0,
    });


    const getFollowerData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userId}/follower`);
            const data = response.data;
            setFollowerData({
                cnt: data.followCnt,
                list: data.list,
                user: data.nickname,
                id: data.id,
            });
        } catch (error) {
            console.error(`팔로워 데이터를 가져오는 중 에러 발생: `, error);
        }
    };

    useEffect(() => {
        getFollowerData();
    }, [userId]);


    return (
        <>
            <MyPageButton userId={userId}/>
            <Box sx={{display:'flex', flexDirection: 'column' ,justifyContent:'center'}}>
                <Box sx={{display: 'inline-flex', gap: 1, marginLeft:8, marginTop:3, marginBottom:0 }}>
                    <Typography sx={{fontWeight: 'bold'}} variant="h6">
                        {followerData.user}님의 팔로워 목록
                    </Typography>
                    <Typography sx={{fontWeight: 'bold', color: '#ff9b9b'}}
                                variant="h6">{followerData.cnt || 0}</Typography>
                </Box>
                <ul>
                    {followerData.list.map(follower => (
                        <FollowItem
                            key={follower.id}
                            id={follower.id}
                            nickname={follower.nickname}
                            birthRange={follower.birthRange}
                            gender={follower.gender}
                            img={follower.profile}
                            intro={follower.introduction}
                        />
                    ))}
                </ul>
            </Box>
        </>
    );
}
export default FollowerList;
