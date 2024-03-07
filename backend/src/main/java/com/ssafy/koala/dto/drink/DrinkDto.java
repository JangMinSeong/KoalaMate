package com.ssafy.koala.dto.drink;

import com.ssafy.koala.dto.cocktail.CocktailWithBoardDto;
import lombok.Data;

import java.util.List;

@Data
public class DrinkDto {
    private long id;

    private String name;
    private int category;
    private String image;
    private String label;

    private List<CocktailWithBoardDto> cocktails;
    private Long fileMetadataId;

}
