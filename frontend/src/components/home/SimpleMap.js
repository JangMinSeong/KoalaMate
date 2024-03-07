import React, {useEffect, useRef, useState} from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import refrig from "../../assets/refrig_map.png";

const SimpleMap= () => {
    const navigate = useNavigate();
    const mapContainer = useRef(null);

    const getAuthHeader = () => {
        const authHeader = localStorage.getItem('authHeader');
        return authHeader ? { Authorization: authHeader } : {};
    };

    useEffect(() => {
            initializeMap(36.1081844, 128.4139686);
        }, []);

    const initializeMap = (lat, lng) => {
        const mapOption = {
            center: new window.kakao.maps.LatLng(lat, lng),
            level: 3
        };

        const map = new window.kakao.maps.Map(mapContainer.current, mapOption);

        const normalImage = new window.kakao.maps.MarkerImage(
            refrig,
            new window.kakao.maps.Size(65, 70),
            { offset: new window.kakao.maps.Point(27, 69) }
        );

        const overImage = new window.kakao.maps.MarkerImage(
            refrig,
            new window.kakao.maps.Size(75, 80),
            { offset: new window.kakao.maps.Point(27, 69) }
        );

        const markerPosition = new window.kakao.maps.LatLng(lat, lng);
        const marker = new window.kakao.maps.Marker({
            position: markerPosition,
            image: normalImage
        });

        marker.setMap(map);

        window.kakao.maps.event.addListener(marker, 'mouseover', function() {
            marker.setImage(overImage);
        });

        window.kakao.maps.event.addListener(marker, 'mouseout', function() {
            marker.setImage(normalImage);
        });

        if(localStorage.getItem('authHeader')) {
            window.kakao.maps.event.addListener(marker, 'click', function() {
                navigate('/mate'); // 여기에 원하는 경로를 설정하세요.
            });
        } else {
            // 마커 클릭 시 로그인으로 이동
            window.kakao.maps.event.addListener(marker, 'click', function() {
                navigate('/login');
            });
        }

    };

    return <div ref={mapContainer} style={{ width: '100%', height: '600px' }} />;
}

export default SimpleMap;