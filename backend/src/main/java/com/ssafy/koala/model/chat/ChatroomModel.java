package com.ssafy.koala.model.chat;

import jakarta.persistence.*;
import lombok.Data;

import java.util.*;

@Entity
@Data
public class ChatroomModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String roomName;
    private boolean isActive;

    @OneToMany(mappedBy = "chatroom", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<MessageModel> messages;

    @OneToMany(mappedBy = "chatroom", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<ChatModel> chats;
}
