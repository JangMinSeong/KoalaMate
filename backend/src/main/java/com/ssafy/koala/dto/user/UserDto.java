package com.ssafy.koala.dto.user;

import lombok.Data;

@Data
public class UserDto {
	private long id;
	private String email;
	private String password;
	private String nickname;
	private double latitude;
	private double longitude;
	private int birthRange;
	private String gender;
	private String profile;
	private boolean isAdmin;
	private String refreshToken;

	private Long fileMetadataId;
}
