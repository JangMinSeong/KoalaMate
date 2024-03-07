import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "./ImageSlider.css";
import { Box } from '@mui/material';

const ImageSlider = () => {
  const images = [
    // 슬라이더 이미지 경로 배열
    {src: "img-banner1.svg", path: localStorage.getItem('authHeader')? "/recipe" : "/login"},
    {src: "img-banner2.svg", path: localStorage.getItem('authHeader')? "/mate" : "/login"},
    {src: "img-banner3.svg", path: localStorage.getItem('authHeader')? "/recipe" : "/login"},
  ];
  const navigate = useNavigate();

  const getAuthHeader = () => {
    const authHeader = localStorage.getItem('authHeader');
    return authHeader ? { Authorization: authHeader } : {};
  };

  const settings = {
    dots: true, // 점 페이징 표시 여부
    infinite: true, // 무한 루프
    speed: 500, // 슬라이드 전환 속도
    slidesToShow: 1, // 한 번에 보여줄 슬라이드 개수
    slidesToScroll: 1, // 스크롤할 슬라이드 개수
    autoplay: true, // 자동 재생 사용
    autoplaySpeed: 5000, // 자동 재생 속도
    cssEase: "linear" // 전환 효과
  };

  const clickTolerance = 10; // 클릭으로 간주할 마우스 이동 최대 허용 오차 (예: 10픽셀)

  const [startPosition, setStartPosition] = React.useState(null);
  const [endPosition, setEndPosition] = React.useState(null);

  const handleMouseDown = (e) => {
    setStartPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = (e) => {
    setEndPosition({ x: e.clientX, y: e.clientY });
  };

  const handleImageClick = (imagePath) => {
    if (startPosition && endPosition) {
      const dx = endPosition.x - startPosition.x; // X축 이동 거리
      const dy = endPosition.y - startPosition.y; // Y축 이동 거리
      const distance = Math.sqrt(dx * dx + dy * dy); // 이동 거리 계산

      // 이동 거리가 허용 오차 내이면 클릭으로 간주
      if (distance <= clickTolerance) {
        navigate(imagePath);
      }
    }

    // 위치 초기화
    setStartPosition(null);
    setEndPosition(null);
  };

  return (
    <Slider {...settings}>
      {images.map((image, idx) => (
        <Box
          key={idx}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onClick={() => handleImageClick(image.path)}
          style={{ height: '100%'}}
        >
          <img src={image.src} alt={`Slide ${idx}`} style={{ width: '100%', borderRadius: '20px'}}/>
        </Box>
      ))}
    </Slider>
  );
};

export default ImageSlider;