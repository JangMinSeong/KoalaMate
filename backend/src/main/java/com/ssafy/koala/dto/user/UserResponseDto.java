package com.ssafy.koala.dto.user;

import com.ssafy.koala.dto.drink.DrinkWithoutCocktailDto;
import lombok.Data;

import java.util.List;

@Data
public class UserResponseDto {
    private long id;
    private String email;
    private String nickname;
    private double latitude;
    private double longitude;
    private int birthRange;
    private String gender;
    private String profile;

    List<DrinkWithoutCocktailDto> drinks;
    boolean isFollow;
    int likeCnt;
}
