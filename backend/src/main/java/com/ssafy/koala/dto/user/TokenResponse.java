package com.ssafy.koala.dto.user;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

@RequiredArgsConstructor
@Getter
@Setter
public class TokenResponse {
	private String accessToken;
	private String refreshToken;
}
