import  React, { useState }  from 'react';
import { FormControl, InputLabel, Select, MenuItem, Container, Grid, IconButton,  InputAdornment, Slider, Typography  } from '@mui/material';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';

export default function RecipeFilter({onCategoryChange, setMinNum, setMaxNum}) {

    // 카테고리 변경
    const [ingredients, setIngredients] = React.useState('');
    const handleIngredientsChange = (event) => {
        setIngredients(event.target.value);
    };

    const [base, setBase] = React.useState('');
    const categories = [
        '',
        '진',
        '럼',
        '보드카',
        '위스키',
        '데킬라',
        '브랜디',
        '리큐르',
        '맥주',
        '소주',
    ];

    const handleBaseChange = (event) => {
        const selectedCategory = event.target.value
        setBase(selectedCategory);
        onCategoryChange(selectedCategory+1); // 부모 컴포넌트에 선택된 카테고리 전달
    };

    const handleClearCategory = () => {
        setBase('');
        onCategoryChange(null);
    };


    // 재료 수 변경
    const [value, setValue] = React.useState([2, 10]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        setMinNum(newValue[0]);
        // 최대값이 10 이상일 경우 백엔드로 보내는 값은 30으로 설정
        setMaxNum(newValue[1] >= 10 ? 30 : newValue[1]);
    };

    const marks = [
        {
            value: 2,
            label: '2',
        },
        {
            value: 10,
            label: '10+',
        },
    ];

    return (
        <Container>
            <Grid container justifyContent='center' spacing={2}>
                <Grid item xs={12} sm={4} sx={{marginRight: '30px'}}>
                    <Typography id="range-slider" gutterBottom>
                        재료 수
                    </Typography>
                    <Slider
                        value={value}
                        onChange={handleChange}
                        valueLabelDisplay="auto"
                        aria-labelledby="range-slider"
                        getAriaValueText={(value) => `${value}`}
                        min={2}
                        max={10}
                        marks={marks}
                    />
                </Grid>

                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="base-label">베이스주</InputLabel>
                        <Select
                            labelId="base-label"
                            id="base-select"
                            value={base}
                            onChange={handleBaseChange}
                            label="Base"
                            endAdornment={
                                (base !== null && base !== '') ? (
                                    <InputAdornment position="end" style={{ marginRight: '20px' }}>
                                        <IconButton
                                            onClick={handleClearCategory}
                                            edge="end"
                                        >
                                            <HighlightOffOutlinedIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null
                            }
                        >
                            {categories.slice(1).map((label, index) => (
                                <MenuItem key={index} value={index}>{label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

            </Grid>
        </Container>
    );
}