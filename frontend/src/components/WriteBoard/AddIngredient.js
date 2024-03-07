import React, { useState } from 'react';
import axios from 'axios';
import {
    Box, Typography, TextField, Button, InputLabel, Select, MenuItem, FormControl, Paper
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

const AddIngredient = ({updateCocktails}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [proportion, setProportion] = useState('');
    const [unit, setUnit] = useState('');

    const fetchIngredients = async (search) => {
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/drink/search?name=${search}`)
                .then((response) => {
                    setSearchResults(response.data);
            });
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };

    const handleSearchChange = (event, value) => {
        setSearchTerm(value);
        if (value) {
            fetchIngredients(value);
        } else {
            setSearchResults([]);
        }
    };

    const handleAddIngredient = () => {
        // proportion을 숫자로 명시적 변환
        const numericProportion = parseFloat(proportion);

        const ingredientToUse = selectedIngredient ?? searchResults.find(item => item.name === searchTerm);
        if (ingredientToUse && numericProportion >= 1 && unit) {
            const newIngredient = {
                proportion: numericProportion,
                unit: unit,
                drink: {
                    id: ingredientToUse.id,
                    name: ingredientToUse.name,
                    category: ingredientToUse.category,
                    image: ingredientToUse.image,
                }
            };
            updateCocktails((prevCocktails) => [...prevCocktails, newIngredient]);
            // 상태 초기화
            resetForm();
        } else {
            alert('용량은 1 이상이어야 합니다.');
        }
    };

    // 입력 폼을 초기화하는 함수
    const resetForm = () => {
        setSearchTerm('');
        setSelectedIngredient(null);
        setProportion('');
        setUnit('');
    };

  //  console.log(searchResults)

    return (
        <Paper sx={{margin: '20px', padding: '20px', backgroundColor: 'white', borderRadius: '15px', display: 'flex',
            flexDirection: 'column',
            gap: 2, }} elevation={3}>
            {/*<Typography>재료 추가</Typography>*/}
            <Autocomplete
                freeSolo
                options={searchResults.map((option) => option.name)}
                value={searchTerm}
                onInputChange={handleSearchChange}
                onChange={(event, newValue) => {
                    const ingredient = searchResults.find(item => item.name === newValue);
                    setSelectedIngredient(ingredient);
                }}
                renderInput={(params) => (
                    <TextField {...params} label="재료 이름을 검색해주세요" variant="outlined" />
                )}
            />
            {/*<Box sx={{ display: 'flex', gap: 2 }}>*/}
                <FormControl fullWidth>
                    <TextField
                        label="용량"
                        type='number'
                        value={proportion}
                        onChange={(e) => {
                            const value = e.target.value ? parseFloat(e.target.value) : '';
                            //console.log(value);
                            if (!value || value >= 1) {
                                setProportion(value);
                            }
                        }}
                        inputProps={{ min: 1 }}
                    />
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel id='unit-label'>단위</InputLabel>
                    <Select
                        labelId='unit-label'
                        label="단위"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                    >
                        <MenuItem value="ml">ml</MenuItem>
                        <MenuItem value="dash">dash</MenuItem>
                        <MenuItem value="teaspoon">teaspoon</MenuItem>
                        <MenuItem value="drops">drops</MenuItem>
                        <MenuItem value="gram">gram</MenuItem>
                        <MenuItem value="개">개</MenuItem>
                        <MenuItem value="slice">slice</MenuItem>
                        <MenuItem value="peel">peel</MenuItem>
                        <MenuItem value="leaves">leaves</MenuItem>
                    </Select>
                </FormControl>
            {/*</Box>*/}
            <Button variant="outlined" onClick={handleAddIngredient} sx={{ alignSelf: 'flex-end' }}>재료 추가</Button>
        </Paper>
    );
}

export default AddIngredient;
