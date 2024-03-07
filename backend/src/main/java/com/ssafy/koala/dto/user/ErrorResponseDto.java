package com.ssafy.koala.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@Getter
@Setter
public class ErrorResponseDto {
    private int statusCode;
    private String exceptionMessage;
    private LocalDateTime time;

}
