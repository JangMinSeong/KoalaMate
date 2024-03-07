package com.ssafy.koala.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.ssafy.koala.model.file.FileMetadata;
import com.ssafy.koala.model.user.UserModel;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class BoardModel {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;
	private String title;
	private String content;

	@CreatedDate
	private LocalDateTime date;

	private int views;
	private String nickname;
	private String image;
	private double dosu = 0;
	@Column(name="user_id")
	private Long userId;
	//Like
//	@OneToMany
//	private List<UserModel> users = new ArrayList<>();


	@OneToMany(mappedBy = "board", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<CocktailModel> cocktails;

	@JsonManagedReference
	@OneToMany(mappedBy = "board", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<CommentModel> comments;

	@OneToMany(mappedBy = "board", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	private List<LikeModel> likes;

	@OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinColumn(name = "file_metadata_id")
	private FileMetadata fileMetadata;
}
