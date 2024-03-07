import React, { useState, useEffect } from "react";
import styles from "./PopularRecipes.module.css";

const recipeNames = [
	// 레시피 이름들의 배열
	"고진감래",
	"미도리 샤워",
	"예거밤",
	// 다른 레시피 이름들...
];

const PopularRecipes = () => {
	const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
	const [isHovering, setIsHovering] = useState(false);

	useEffect(() => {
		let interval = setInterval(() => {
			if (!isHovering) {
			setCurrentRecipeIndex(
					(currentRecipeIndex) => (currentRecipeIndex + 1) % recipeNames.length
			)}
		}, 3000); // 3초마다 레시피 변경

		return () => clearInterval(interval);
	}, [isHovering]);

	const handleMouseEnter = (index) => {
		setIsHovering(true);
		setCurrentRecipeIndex(index);
	};

	const handleMouseLeave = () => {
		setIsHovering(false);
	};


	// return (
	// 		<div className={styles.container}>
	// 			<div className={styles.fixedText}>
	// 				<span className={styles.flameIcon}>🔥</span> 지금 핫한 레시피 Top 10
	// 			</div>
	// 			<div
	// 				className={styles.recipesContainer}
	// 				onMouseEnter={() => setIsHovering(true)} // 마우스가 영역에 들어오면 멈춤
	// 				onMouseLeave={() => setIsHovering(false)} // 마우스가 영역을 벗어나면 다시 시작
	// 			>
	// 				<div
	// 						className={styles.recipe}
	// 						style={{ transform: `translateY(${-currentRecipeIndex * 100}%)` }}
	// 				>
	// 					{recipeNames.map((name, index) => (
	// 						<div key={index} className={styles.recipeName}>
	// 							{name}
	// 						</div>
	// 					))}
	// 				</div>
	// 			</div>
	// 		</div>
	// );
	return (
		<div className={styles.container}>
			<div className={styles.fixedText}>
				<span className={styles.flameIcon}>🔥</span> 지금 핫한 레시피 Top 10
			</div>
			<div
				className={styles.recipesContainer}
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
			>
				{recipeNames.map((name, index) => (
					<div
						key={index}
						className={`${styles.recipeName} ${index === currentRecipeIndex ? styles.show : styles.hide}`}
					>
						{name}
					</div>
				))}
			</div>
		</div>
	);
};

export default PopularRecipes;
