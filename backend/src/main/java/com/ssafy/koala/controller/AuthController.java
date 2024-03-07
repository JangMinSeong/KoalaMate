package com.ssafy.koala.controller;

import com.ssafy.koala.config.jwt.JwtUtil;
import com.ssafy.koala.dto.user.UserDto;
import com.ssafy.koala.model.user.UserModel;
import com.ssafy.koala.service.user.CustomUserDetailsService;
import com.ssafy.koala.service.user.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@AllArgsConstructor
public class AuthController {

	private final JwtUtil jwtUtil;
	private final UserService userService;

	// 사용자 인증 : 토큰 검사
	@GetMapping("/status")
	public Object checkAuthStatus(HttpServletRequest request, HttpServletResponse response) {
		String authorizationHeader = request.getHeader("Authorization");

		// access token이 헤더에 있는 경우
		if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
			String token = authorizationHeader.substring(7);
			// access token이 유효한 경우
			if (jwtUtil.validateToken(token)) {
				return new ResponseEntity<>(HttpStatus.OK);
			}
			// access token이 유효하지 않다면,쿠키에서 refreshToken 추출
			Cookie[] cookies = request.getCookies();
			if (cookies == null) {
				return new ResponseEntity<>("null cookies", HttpStatus.UNAUTHORIZED);
			}
			// 쿠키 배열을 순회하면서 원하는 쿠키를 찾음
			for (Cookie cookie : cookies) {
				if ("refresh_token".equals(cookie.getName())) {
					String refreshToken = cookie.getValue();

					// refresh token 유효성 검사
					if(jwtUtil.validateToken(refreshToken)) {
						// db에서 해당 유저의 정보를 가져옴
						Optional<UserDto> user = userService.findUserByRefreshToken(refreshToken);

						// db에 저장된 refresh token과 사용자가 준 refresh token이 동일하지 않으면 권한x
						if(user.isEmpty()) {
							return new ResponseEntity<>("invalid refresh token. please login again", HttpStatus.UNAUTHORIZED);
						}

						// access token 생성, ok 반환
						String newToken = jwtUtil.createAccessToken(user.get());
						response.addHeader("Authorization", "Bearer " + newToken);
						return new ResponseEntity<>(HttpStatus.OK);
					}
					// refresh token 만료됨
					return new ResponseEntity<>("token is expired. please login again", HttpStatus.UNAUTHORIZED);
				}
			}
			return new ResponseEntity<>("refresh token is not in cookie", HttpStatus.UNAUTHORIZED);
		}
		return new ResponseEntity<>("access token is not in Authorization header", HttpStatus.UNAUTHORIZED);
	}
}
