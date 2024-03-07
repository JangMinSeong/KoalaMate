package com.ssafy.koala.dto.cocktail;

import com.ssafy.koala.dto.board.BoardWithoutCocktailDto;
import lombok.Data;

@Data
public class CocktailWithBoardDto {
    private Long id;

    private double proportion;  //비율
    private String unit;  //단위

    private BoardWithoutCocktailDto board;
}
