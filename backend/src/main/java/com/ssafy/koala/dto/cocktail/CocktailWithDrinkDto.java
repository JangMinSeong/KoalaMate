package com.ssafy.koala.dto.cocktail;

import com.ssafy.koala.dto.drink.DrinkWithoutCocktailDto;
import lombok.Data;

@Data
public class CocktailWithDrinkDto {
    private Long id;

    private double proportion;  //비율
    private String unit;  //단위

    private DrinkWithoutCocktailDto drink;
}
