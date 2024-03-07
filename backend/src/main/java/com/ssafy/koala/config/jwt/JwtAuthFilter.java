package com.ssafy.koala.config.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;
import com.ssafy.koala.service.user.CustomUserDetailsService;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter { // OncePerRequestFilter -> 한 번 실행 보장

	private final CustomUserDetailsService customUserDetailsService;
	private final JwtUtil jwtUtil;

	@Override
	/**
	 * JWT 토큰 검증 필터 수행
	 */
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
		String authorizationHeader = request.getHeader("Authorization");
		//System.out.println(request);
		//JWT가 헤더에 있는 경우
		if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
			String token = authorizationHeader.substring(7);
			//JWT 유효성 검증
			if (jwtUtil.validateToken(token)) {
				String userEmail = jwtUtil.getUserEmail(token);

				//유저와 토큰 일치 시 userDetails 생성
				UserDetails userDetails = customUserDetailsService.loadUserByUsername(userEmail);

				if (userDetails != null) {
					//UserDetsils, Password, Role -> 접근권한 인증 Token 생성
					UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
							new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

					//현재 Request의 Security Context에 접근권한 설정
					SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
					//System.out.println("\n\nasdasdasdasdasads\n" + SecurityContextHolder.getContext().getAuthentication());
				}
			}
			else {
				response.getWriter().write("토큰이 유효하지 않습니다. 다시 로그인 해주세요");
			}
		}
		filterChain.doFilter(request, response); // 다음 필터로 넘기기
	}
}