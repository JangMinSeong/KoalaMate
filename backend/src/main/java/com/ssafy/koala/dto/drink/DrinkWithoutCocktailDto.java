package com.ssafy.koala.dto.drink;

import lombok.Data;

@Data
public class DrinkWithoutCocktailDto {
    private long id;

    private String name;
    private int category;
    private String image;
    private String label;
    private Long fileId;
}
