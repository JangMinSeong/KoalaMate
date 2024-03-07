// import React, { useEffect, useRef } from 'react';
// import refrig from 'assets/refrig_map.png'; // 기본 마커 이미지 경로
// import style from 'components/FindMate/Map.module.css';
//
// function Map() {
// 	const mapContainer = useRef(null);
//
// 	useEffect(() => {
// 		// 위치 정보 활용 동의
// 		const confirmLocationAccess = window.confirm("위치 정보 활용에 동의하고 내 주변 냉장고를 찾아볼까요?");
//
// 		if (!confirmLocationAccess) {
// 			console.log("위치 정보 활용에 동의하지 않았습니다.");
// 			// 동의하지 않았을 경우에도 기본 위치로 지도 초기화
// 			initializeMap(36.1081844, 128.4139686);
// 			return;
// 		}
//
// 		if (navigator.geolocation) {
// 			navigator.geolocation.getCurrentPosition((position) => {
// 				const { latitude, longitude } = position.coords;
// 				initializeMap(latitude, longitude);
// 				console.log(latitude + " " + longitude);
// 			}, () => {
// 				console.error("위치 정보를 가져올 수 없습니다.");
// 				initializeMap(36.1081844, 128.4139686);
// 			});
// 		} else {
// 			console.log("이 브라우저에서는 위치 정보가 지원되지 않습니다.");
// 			initializeMap(36.1081844, 128.4139686);
// 		}
// 	},
// 		{
// 			enableHighAccuracy: true, // 더 높은 정확도 활성화
// 			timeout: 10000, // 10초 내에 위치 정보를 가져오지 못하면 에러
// 			maximumAge: 0 // 캐시된 위치 정보 사용 안 함
// 		});
//
// 	const initializeMap = (lat, lng) => {
// 		const mapOption = {
// 			center: new window.kakao.maps.LatLng(lat, lng),
// 			level: 3
// 		};
//
// 		const map = new window.kakao.maps.Map(mapContainer.current, mapOption);
//
// 		const normalImage = new window.kakao.maps.MarkerImage(
// 				refrig,
// 				new window.kakao.maps.Size(65, 70),
// 				{ offset: new window.kakao.maps.Point(27, 69) }
// 		);
//
// 		const overImage = new window.kakao.maps.MarkerImage(
// 				refrig,
// 				new window.kakao.maps.Size(75, 80),
// 				{ offset: new window.kakao.maps.Point(27, 69) }
// 		);
//
// 		const markerPosition = new window.kakao.maps.LatLng(lat, lng);
// 		const marker = new window.kakao.maps.Marker({
// 			position: markerPosition,
// 			image: normalImage
// 		});
//
// 		marker.setMap(map);
//
// 		window.kakao.maps.event.addListener(marker, 'mouseover', function() {
// 			marker.setImage(overImage);
// 		});
//
// 		window.kakao.maps.event.addListener(marker, 'mouseout', function() {
// 			marker.setImage(normalImage);
// 		});
//
// 		// // 커스텀 오버레이에 표출될 내용
// 		// var content = `<div class="${style.customoverlay}">` + // CSS 모듈의 클래스 이름 사용
// 		// 		'<a href="https://map.kakao.com/" target="_blank">' +
// 		// 		'<span class="title">닉네임</span>' + // 'title' 클래스도 CSS 모듈을 통해 관리해야 한다면 같은 방식으로 적용
// 		// 		'</a>' +
// 		// 		'</div>';
// 		//
// 		// // 커스텀 오버레이를 생성합니다
// 		// var customOverlay = new window.kakao.maps.CustomOverlay({
// 		// 	map: map,
// 		// 	position: markerPosition,
// 		// 	content: content,
// 		// 	yAnchor: 1
// 		// });
// 	};
//
// 	return <div ref={mapContainer} style={{ width: '100%', height: '600px' }} />;
// }
//
// export default Map;

import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import refrig from 'assets/refrig_map.png'; // 기본 마커 이미지 경로
import style from 'components/FindMate/Map.module.css';
import {useSelector} from "react-redux";
import defaultProfile from 'assets/logo2.png';

import { useMap } from 'context/MapContext';

const Map = ()  => {
    const [userData, setUserData] = useState([]);
    const navigate = useNavigate(); // useNavigate 사용
    const curUser = useSelector(state => state.auth.user);

    const { setVisibleMarkersData } = useMap();
    const mapContainer = useRef(null);
    const [map, setMap] = useState(null);


    useEffect(() => {
        const confirmLocationAccess = window.confirm("위치 정보 활용에 동의하고 내 주변 냉장고를 찾아볼까요?");
        if (!confirmLocationAccess) {
        //    console.log("위치 정보 활용에 동의하지 않았습니다.");
            navigate('/')
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/findmate/listMate`, {
                    headers: { 'Authorization': localStorage.getItem('authHeader') },
                });
                initializeMap(response.data);
            } catch (error) {
                console.error("유저 데이터를 가져오는 중 오류 발생", error);
            }
        };

        fetchUserData();
    }, []);

    const initializeMap = (userData) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const mapOption = {
                    center: new window.kakao.maps.LatLng(position.coords.latitude, position.coords.longitude),
                    level: 3,
                };
                const map = new window.kakao.maps.Map(mapContainer.current, mapOption);
                addMarkers(map, userData);
                updateVisibleMarkers(map, userData);
                window.kakao.maps.event.addListener(map, 'idle', () => updateVisibleMarkers(map, userData));
            }, () => {
                console.error("위치 정보를 가져올 수 없습니다.");
            });
        } else {
            console.log("이 브라우저에서는 위치 정보가 지원되지 않습니다.");
        }
    };


    const addMarkers = (map, userData) => {
        userData.forEach(user => {
            if (user.nickname !== curUser.nickname && user.nickname !== 'admin') {
                const markerPosition = new window.kakao.maps.LatLng(user.latitude, user.longitude);
                const marker = new window.kakao.maps.Marker({
                    position: markerPosition,
                    image: new window.kakao.maps.MarkerImage(refrig, new window.kakao.maps.Size(65, 70), { offset: new window.kakao.maps.Point(27, 69) }),
                });

                // follow 상태에 따른 하트 아이콘 표시
                const followHeartSVG = user.follow ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" style="fill: #ff1744;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>` : '';

                const content = `
        <div style="
            padding: 5px; 
            position: relative;
            display: flex; 
            align-items: center; 
            gap: 10px; 
            background-color: white; 
            border-radius: 10px; 
            box-shadow: 0 2px 8px rgba(0,0,0,0.15); 
            border: 1px solid #fff;
            transform: translate(-50%, -100%);
            ">
            <img src="${user.profile ? `${user.profile}` : `${defaultProfile}`}" alt="프로필 사진" style="width: 40px; height: 40px; border-radius: 50%;" />
            <div style="font-size: 14px; font-weight: 500;">${user.nickname}</div>
            <div style="position: absolute; top: -10px; right: -10px;">${followHeartSVG}</div>
        </div>
    `;



                // 커스텀 오버레이 생성
                const customOverlay = new window.kakao.maps.CustomOverlay({
                    content: content,
                    map: null, // 처음에는 지도에 표시하지 않음
                    position: markerPosition
                });

                // 마커에 마우스 오버 이벤트 리스너 추가
                window.kakao.maps.event.addListener(marker, 'mouseover', function () {
                    customOverlay.setMap(map);
                });

                // 마커에 마우스 아웃 이벤트 리스너 추가
                window.kakao.maps.event.addListener(marker, 'mouseout', function () {
                    customOverlay.setMap(null);
                });

                // 마커 클릭 이벤트 추가
                window.kakao.maps.event.addListener(marker, 'click', function () {
                    navigate(`/user/${user.id}`);
                });

                marker.setMap(map);
                // 마커에 클릭 이벤트를 추가할 수 있습니다.
            }
        });
    };

    const updateVisibleMarkers = (map, userData) => {
        const bounds = map.getBounds();
        const visibleMarkers = userData.filter(user => {
            const position = new window.kakao.maps.LatLng(user.latitude, user.longitude);
            return bounds.contain(position) && user.nickname !== curUser.nickname && user.nickname !== 'admin';
        });
        setVisibleMarkersData(visibleMarkers);
    };

    return <div ref={mapContainer}
                style={{
                    width: '100%',
                    height: '600px',
                    borderRadius: '15px',
                    overflow: 'hidden'}} />;
};

export default Map;