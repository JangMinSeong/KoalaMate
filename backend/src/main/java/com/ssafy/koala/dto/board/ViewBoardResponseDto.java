package com.ssafy.koala.dto.board;

import com.ssafy.koala.dto.cocktail.CocktailWithDrinkDto;
import com.ssafy.koala.dto.CommentDto;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
public class ViewBoardResponseDto {
    private long id;
    private String title;
    private String content;
    private LocalDateTime date;
    private int views;
    private String nickname;
    private String image;
    private List<CocktailWithDrinkDto> cocktails;
    private List<CommentDto> comments;
    private boolean isLiked;
    private long likeCount;
}
