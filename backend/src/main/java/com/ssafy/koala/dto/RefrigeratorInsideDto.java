package com.ssafy.koala.dto;

import com.ssafy.koala.dto.drink.DrinkWithoutCocktailDto;
import com.ssafy.koala.model.RefrigeratorDrinkModel;
import lombok.Data;

import java.util.List;

@Data
public class RefrigeratorInsideDto {
    private Long id;
    private Long refrigeratorId;
    private DrinkWithoutCocktailDto drink;
    private int posIdx;
}
