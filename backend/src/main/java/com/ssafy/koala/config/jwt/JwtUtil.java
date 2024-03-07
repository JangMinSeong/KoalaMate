package com.ssafy.koala.config.jwt;

import com.ssafy.koala.dto.user.UserDto;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.ZonedDateTime;
import java.util.Date;

// JWT 관련 메서드 제공 클래스
@Slf4j
@Component
public class JwtUtil {
	private final Key key;
	private final long accessTokenExpTime;
	private final long refreshTokenExpTime;

	public JwtUtil(
			@Value(value = "${jwt.secret}") String secretKey,
			@Value(value = "${jwt.expirationTime}") long accessTokenExpTime,
			@Value(value = "${jwt.refreshTokenExpTime}") long refreshTokenExpTime
	) {
		byte[] keyBytes = Decoders.BASE64.decode(secretKey);
		this.key = Keys.hmacShaKeyFor(keyBytes);
		this.accessTokenExpTime = accessTokenExpTime;
		this.refreshTokenExpTime = refreshTokenExpTime;
	}

	// Access Token 생성
	public String createAccessToken(UserDto user) {
		return createToken(user, "Access_token", accessTokenExpTime);
	}

	// Refresh Token 생성
	public String createRefreshToken(UserDto user) {
		return createToken(user, "Refresh_token", refreshTokenExpTime);
	}

	// JWT 생성
	private String createToken(UserDto user, String subject, long expireTime) {
		Claims claims = Jwts.claims();
		claims.put("subject", subject);
		claims.put("userId", user.getId());
		claims.put("email", user.getEmail());
		claims.put("nickname", user.getNickname());
		claims.put("isAdmin", user.isAdmin());

		ZonedDateTime now = ZonedDateTime.now();
		ZonedDateTime tokenValidity = now.plusSeconds(expireTime);


		return Jwts.builder()
				.setClaims(claims)
				.setIssuedAt(Date.from(now.toInstant()))
				.setExpiration(Date.from(tokenValidity.toInstant()))
				.signWith(key, SignatureAlgorithm.HS256)
				.compact();
	}


	// 토큰에서 user id 추출
	public Long getUserId(String token) {
		return parseClaims(token).get("userId", Long.class);
	}

	// 토큰에서 이메일 추출
	public String getUserEmail(String token) {
		return parseClaims(token).get("email", String.class);
	}

	// 토큰에서 닉네임 추출
	public String getNickname(String token) {
		return parseClaims(token).get("email", String.class);
	}

	// JWT 검증
	public boolean validateToken(String token) {
		try {
			Claims claims = Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
			Date expiration = claims.getExpiration(); // 토큰의 만료 시간을 가져옴
			// 현재 시간과 비교하여 토큰이 만료되었는지 확인
			if(expiration.before(new Date())) {
				return false;
			}
			return true;
		} catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
			log.info("Invalid JWT Token", e);
		} catch (ExpiredJwtException e) {
			log.info("Expired JWT Token", e);
		} catch (UnsupportedJwtException e) {
			log.info("Unsupported JWT Token", e);
		} catch (IllegalArgumentException e) {

			log.info("JWT claims string is empty.", e);
		}
		return false;
	}


	// JWT Claims 추출
	public Claims parseClaims(String accessToken) {
		try {
			return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(accessToken).getBody();
		} catch (ExpiredJwtException e) {
			return e.getClaims();
		}
	}
}
