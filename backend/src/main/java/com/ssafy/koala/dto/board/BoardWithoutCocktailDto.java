package com.ssafy.koala.dto.board;

import com.ssafy.koala.model.CommentModel;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
public class BoardWithoutCocktailDto {
    private long id;
    private String title;
    private String content;
    private LocalDateTime date;
    private int views;
    private String nickname;
    private String image;
    private boolean isLike = false;
    //private List<CommentModel> comments;
}
