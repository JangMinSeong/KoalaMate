package com.ssafy.koala.service;

import com.ssafy.koala.config.jwt.JwtUtil;
import com.ssafy.koala.dto.user.UserDto;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtUtil jwtUtil;

    // access token에서 유저 정보 추출 : 프론트는 AuthController에서 리다이렉트 된다고 가정함.
    public UserDto extractUserFromToken(String accessToken) {
        UserDto user = new UserDto();
        Claims claims = jwtUtil.parseClaims(accessToken);
        user.setId(claims.get("userId", Long.class));
        user.setEmail(claims.get("email", String.class));
        user.setNickname(claims.get("nickname", String.class));

        return user;
    }

    // http header에서 Access token 추출
    public String getAccessToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        throw new BadCredentialsException("access token is not in Authorization header");
    }
}
