//package com.ssafy.koala.config;
//
//import org.springframework.context.annotation.Bean;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
//// swagger가 jwt 인터셉터나 필터에 적용되지 않게 설정
//public class WebMvcConfig implements WebMvcConfigurer {
//
//    @Value("${spring.url}")
//    private static String URI;
//
//    @Override
//    public void addInterceptors(InterceptorRegistry registry) {
//        registry.addInterceptor(jwtTokenInterceptor())
//                .excludePathPatterns(URI + "/swagger-resources/**", URI + "/swagger-ui/**", URI + "/v3/api-docs", URI + "/api-docs/**")
//                .excludePathPatterns("/swagger-resources/**", "/swagger-ui/**", "/v3/api-docs", "/api-docs/**")
//                .excludePathPatterns("/signUp", "/signIn", "/error/**", "/reissue")
//                .addPathPatterns("/**");
//    }
//
//    @Bean
//    public JwtTokenInterceptor jwtTokenInterceptor() {
//        return new JwtTokenInterceptor(...);
//    }
//}