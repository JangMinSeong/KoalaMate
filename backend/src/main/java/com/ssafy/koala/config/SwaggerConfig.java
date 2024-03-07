package com.ssafy.koala.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;

@Configuration
@OpenAPIDefinition
public class SwaggerConfig {
	@Bean
	// localhost:xxxx/swagger-ui/index.html#/  << 접속경로
	public OpenAPI baseOpenAPI() {
		SecurityScheme securityScheme = new SecurityScheme()
		.type(SecurityScheme.Type.HTTP).scheme("bearer").bearerFormat("JWT")
			.in(SecurityScheme.In.HEADER).name("Authorization");
		SecurityRequirement securityRequirement = new SecurityRequirement().addList("bearerAuth");
		return new OpenAPI()
				.components(new Components().addSecuritySchemes("bearerAuth", securityScheme))
				.security(Arrays.asList(securityRequirement))
				.info(new Info().title("koala-back").version("1.0").description("backend api"));
	}
}

