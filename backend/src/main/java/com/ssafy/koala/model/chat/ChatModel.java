package com.ssafy.koala.model.chat;

import com.ssafy.koala.model.user.UserModel;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ChatModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private int theme = 0;
    private long lastId = 0;

    @ManyToOne
    @JoinColumn(name = "chatroom_id")
    private ChatroomModel chatroom;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserModel user;
    // 기타 필드 및 메서드
}
