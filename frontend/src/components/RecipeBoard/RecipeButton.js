import React, {useState} from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

function RecipeButtons({setOptionNum}) {
	const [clickedButton, setClickedButton] = useState('all')

	// 버튼 클릭 이벤트 핸들러 함수들
	const handleAllRecipesClick = () => {
		setOptionNum(1)
		setClickedButton('all')
	};

	const handleKoalaRecipesClick = () => {
		setOptionNum(2)
		setClickedButton('admin')
	};

	const handleUserRecipesClick = () => {
		setOptionNum(3)
		setClickedButton('user')
	};

	// 버튼 스타일을 동적으로 변경하기 위한 함수
	const getButtonStyle = (buttonName) => ({
		backgroundColor: clickedButton === buttonName ? '#FF9B9B' : '',
		color: clickedButton === buttonName ? 'white' : '#FF9B9B',
		borderRadius: '10px',
		fontWeight: 'bold',
		borderColor: '#FF9B9B', // 버튼 그룹에 있는 버튼들을 위해 추가
	});

	return (
			<div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
				{/* 독립적인 '전체 조회' 버튼 */}
				<Button
					variant="outlined"
					style={getButtonStyle('all')}
					onClick={handleAllRecipesClick}
				>
					전체 조회
				</Button>

				{/* '레시피 백과'와 '유저 레시피'를 포함한 버튼 그룹 */}
				<ButtonGroup
						variant="outlined"
						aria-label="outlined secondary button group"
						style={{ gap: '10px' }}
				>
					<Button
							onClick={handleKoalaRecipesClick}
							style={getButtonStyle('admin')}
					>
						레시피 백과
					</Button>
					<Button
							onClick={handleUserRecipesClick}
							style={getButtonStyle('user')}
					>
						유저 레시피
					</Button>
				</ButtonGroup>
			</div>
	);
}

export default RecipeButtons;
