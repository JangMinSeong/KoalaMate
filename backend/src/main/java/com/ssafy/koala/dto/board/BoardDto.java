package com.ssafy.koala.dto.board;

import com.ssafy.koala.model.CocktailModel;
import com.ssafy.koala.model.CommentModel;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class BoardDto {
	private long id;
	private String title;
	private String content;
	private LocalDateTime date;
	private int views;
	private String nickname;
	private String image;

	private List<CocktailModel> cocktails;
	private List<CommentModel> comments;
	private Long fileMetadataId;
}
