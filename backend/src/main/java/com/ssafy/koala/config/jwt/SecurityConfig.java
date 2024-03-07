package com.ssafy.koala.config.jwt;

import com.ssafy.koala.service.user.CustomUserDetailsService;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.config.Customizer;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@AllArgsConstructor
public class SecurityConfig {
	private final CustomUserDetailsService customUserDetailsService;
	private final JwtUtil jwtUtil;
	private final CustomAccessDeniedHandler accessDeniedHandler;
	private final CustomAuthenticationEntryPoint authenticationEntryPoint;

	private static final String[] AUTH_WHITELIST = {
			"/api/v1/member/**", "/swagger-ui/**", "/api-docs", "/swagger-ui-custom.html",
			"/v3/api-docs/**", "/api-docs/**", "/swagger-ui.html", "/api/v1/auth/**", "/user/**", "/board/**",
			"/comment/**","/drink/**","/recipe/**","/cocktail/**", "/chat/**", "/auth/**", "/customobj/**",
			"/refrigerator/**", "/profile/**", "/chatroom/**", "/message/**", "/socket/**", "/findmate/**", "/error/**",
			"/api/files/**"

	};

	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
				.cors(Customizer.withDefaults()) // CORS 설정 적용
				.authorizeHttpRequests(authorize -> authorize.requestMatchers(AUTH_WHITELIST).permitAll())
				.csrf(csrf -> csrf.disable()) // CSRF 설정 적용
				// JwtAuthFilter를 UsernamePasswordAuthenticationFilter 앞에 추가
				.addFilterBefore(new JwtAuthFilter(customUserDetailsService, jwtUtil), UsernamePasswordAuthenticationFilter.class);
				//세션 관리 상태 없음으로 구성, Spring Security가 세션 생성 or 사용 X
//				.sessionManagement(sessionManagement -> sessionManagement.sessionCreationPolicy(
//						SessionCreationPolicy.STATELESS))
				//FormLogin, BasicHttp 비활성화
//				.formLogin((form) -> form.disable())
//				.httpBasic(httpBasic -> httpBasic.disable())
				// 예외 처리
//				.exceptionHandling((exceptionHandling) -> exceptionHandling
//						.authenticationEntryPoint(authenticationEntryPoint)
//						.accessDeniedHandler(accessDeniedHandler)
//				);

		return http.build();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
		return authenticationConfiguration.getAuthenticationManager();
	}
}