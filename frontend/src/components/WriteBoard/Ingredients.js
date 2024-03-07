import React from 'react'
import {Paper, Avatar, Chip, List, ListItem, ListItemAvatar, ListItemText, Typography, IconButton, Tooltip} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const Ingredients = ({cocktails, onDeleteIngredient}) => {
    const categories = [
        // '무알콜',
        '기타 재료',
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
    return (
        <Paper sx={{margin: '20px', padding: '20px', backgroundColor: 'white', borderRadius: '15px'}} elevation={3}>
            {cocktails.map((ingredient, index) => (
                <List key={index} sx={{mt: 1}}>
                    <ListItem key={index} sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <ListItemAvatar>
                            <Avatar src={ingredient.drink.image} alt={ingredient.drink.name}
                                    sx={{width: 56, height: 56, bgcolor: '#FF9B9B'}}/>
                        </ListItemAvatar>

                        <ListItemText>
                            <ListItemText
                                variant="body3"
                                primary={ingredient.drink.name}
                                sx={{margin: '0 16px', flex: '1 1 auto'}}
                            />
                            <Chip label={`#${categories[ingredient.drink.category]}`}
                                  sx={{margin: '5px 16px', flex: '1 1 auto'}}/>
                        </ListItemText>

                        <Typography variant="body3" sx={{minWidth: '50px', textAlign: 'right'}}>
                            {`${ingredient.proportion} ${ingredient.unit}`}
                        </Typography>

                        {/* 삭제 버튼 */}
                        <Tooltip title="Delete">
                            <IconButton
                                sx={{marginX:'5px'}}
                                aria-label="delete"
                                onClick={() => onDeleteIngredient(index)}
                            >
                                <DeleteIcon/>
                            </IconButton>
                        </Tooltip>

                    </ListItem>
                </List>
            ))}
        </Paper>
    )
}
export default Ingredients