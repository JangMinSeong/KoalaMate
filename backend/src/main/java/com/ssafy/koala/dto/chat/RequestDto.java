package com.ssafy.koala.dto.chat;

import lombok.Data;

@Data
public class RequestDto {
    private String userEmail;
    private long chatroomId;
}
