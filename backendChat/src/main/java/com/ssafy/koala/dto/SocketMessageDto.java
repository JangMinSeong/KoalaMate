package com.ssafy.koala.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SocketMessageDto {
    private long roomId;

    private String sessionId;
    private String nickname;
    private String content;
}
