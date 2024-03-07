package com.ssafy.koala.dto.cocktail;

import com.ssafy.koala.model.BoardModel;
import com.ssafy.koala.model.DrinkModel;
import lombok.Data;

@Data
public class CocktailDto {
    private Long id;

    private double proportion;  //비율
    private String unit;  //단위

    private DrinkModel drink;
    private BoardModel board;
}
