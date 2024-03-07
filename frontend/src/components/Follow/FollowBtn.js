import React, {useState, useEffect} from 'react'
import {Button, Box} from '@mui/material';
import axios from "axios";
import {useSelector} from "react-redux";

const FollowBtn = ({targetUserId}) => {

    const [isFollow, setIsFollow] = useState(false)

    // 인증 헤더를 가져오는 함수
    const getAuthHeader = () => {
        const authHeader = localStorage.getItem('authHeader');
        return authHeader ? {Authorization: authHeader} : {};
    };

    // 사용자의 팔로우 상태를 확인하는 함수
    const checkFollowStatus = async () => {
        try {
            // 현재 사용자가 targetUserId를 팔로우하고 있는지 여부를 반환
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/followCheck?userId=${targetUserId}`, {
                headers: getAuthHeader(), // 인증 헤더 추가
            })
            setIsFollow(response.data.isFollow);
        } catch (error) {
            console.error('팔로우 상태 확인 에러', error);
        }
    };


    const toggleFollow = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/follow`, {
                id: targetUserId,
            }, {
                headers: getAuthHeader(),
            });
            // 요청 성공 후 상태 업데이트
            setIsFollow(response.data.isFollow)
        } catch (error) {
            console.error('팔로우/언팔로우 요청 에러', error);
        }
    }


    // 타겟 아이디가 바뀌면 현재 사용자가 targetUserId를 팔로우하고 있는지 상태 업데이트
    useEffect(() => {
        checkFollowStatus();
    }, [targetUserId]);

    return (
        <Box m={2}>
            <Button variant="contained" onClick={toggleFollow} fullWidth
                    sx={{
                        mr: 1,
                        mb: 1,
                        backgroundColor: isFollow ? '#fff' :  '#ff9b9b' ,
                        color: isFollow ? '#ff9b9b' : '#fff' ,
                    }}>
                {isFollow ? '언팔로우' : '팔로우'}
            </Button>
        </Box>
    )
}
export default FollowBtn