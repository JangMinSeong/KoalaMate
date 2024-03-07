import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MyPageButton from '../components/Profile/MyPageButton';
import FollowItem from '../components/Follow/FollowItem';
import {Box, Typography} from '@mui/material';
import {Types} from "three/addons/libs/ecsy.module";

const FolloweeList = () => {
	const { userId } = useParams();

	const [followeeData, setFolloweeData] = useState({
		cnt: 0,
		list: [],
		user: '',
		id: 0,
	});

	const getFolloweeData = async () => {
		try {
			const response = await axios.get(`${process.env.REACT_APP_API_URL}/user/${userId}/followee`);
			const data = response.data;
			setFolloweeData({
				cnt: data.followCnt,
				list: data.list,
				user: data.nickname,
				id: data.id,
			});
		} catch (error) {
	//		console.log(`팔로잉 데이터를 가져오는 중 에러 발생: `, error);
		}
	};

	useEffect(() => {
		getFolloweeData();
	}, [userId]);


	return (
			<>
				<MyPageButton userId={userId}/>
				<Box sx={{display:'flex', flexDirection: 'column' ,justifyContent:'center'}}>
					<Box sx={{display: 'inline-flex', gap: 1, marginLeft:8, marginTop:3, marginBottom:0 }}>
						<Typography sx={{fontWeight: 'bold'}} variant="h6">
							{followeeData.user}님의 팔로잉 목록
						</Typography>
						<Typography sx={{fontWeight: 'bold', color: '#ff9b9b'}}
									variant="h6">{followeeData.cnt || 0}</Typography>
					</Box>
				<ul>
					{followeeData.list.map(followee => (
							<FollowItem
									key={followee.id}
									id={followee.id}
									nickname={followee.nickname}
									birthRange={followee.birthRange}
									gender={followee.gender}
									img={followee.profile}
									intro={followee.introduction}
							/>
					))}

				</ul>
				</Box>
			</>
	);
};

export default FolloweeList;
