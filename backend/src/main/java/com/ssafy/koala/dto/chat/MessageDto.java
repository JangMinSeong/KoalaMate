package com.ssafy.koala.dto.chat;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@NoArgsConstructor
public class MessageDto {
    private long id;
    private String nickname;

    private String content;
    private LocalDateTime date = LocalDateTime.now();

}
