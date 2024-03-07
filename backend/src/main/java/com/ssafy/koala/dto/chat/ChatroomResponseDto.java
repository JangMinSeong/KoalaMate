package com.ssafy.koala.dto.chat;

import com.ssafy.koala.dto.user.UserListDto;
import lombok.Data;

import java.util.List;

@Data
public class ChatroomResponseDto {
    private long id;
    private int theme;
    private String roomName;
    private boolean isActive;
    private long confirmMessageId;
    private List<UserListDto> users;
    private MessageDto lastMessage;
}
