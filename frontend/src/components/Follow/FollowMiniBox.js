import React, {useEffect, useState} from 'react';
import {NavLink} from "react-router-dom";
import {Box, Button} from "@mui/material";


const FollowMiniBox = ({ userId, followerCnt, followeeCnt }) => {
    return (
        <>
            <Box style={{
                display: 'flex',
                marginTop: '10px',
                marginBottom: '10px',
                // gap: 10,
            }}>

                <Button m={1} p={1} component={NavLink}
                        to={`/user/${userId}/follower`}>팔로워 {followerCnt}</Button>
                <Button m={1} p={1} component={NavLink}
                        to={`/user/${userId}/followee`}>팔로우 {followeeCnt}</Button>

            </Box>
        </>
    )
}
export default FollowMiniBox