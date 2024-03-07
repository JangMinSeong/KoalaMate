// ScrollAnimationCanvas.js
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollAnimationCanvas = ({ images }) => {
	const canvasRef = useRef(null);
	const contextRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		const context = canvas.getContext('2d');
		contextRef.current = context;

		const totalFrames = images.length;
		let currentFrame = 0;

		ScrollTrigger.create({
			trigger: "#trigger",
			start: "top top",
			end: "+=5000",
			scrub: true,
			pin: true,
			onUpdate: (self) => {
				const progress = self.progress; // 0에서 1 사이의 값
				currentFrame = Math.min(Math.floor(progress * totalFrames), totalFrames - 1);
				const img = new Image();
				img.src = images[currentFrame];
				img.onload = () => {
					context.clearRect(0, 0, canvas.width, canvas.height);
					context.drawImage(img, 0, 0, canvas.width, canvas.height);
				};
			}
		});

	}, [images]);

	return <canvas ref={canvasRef} />;
};

export default ScrollAnimationCanvas;
