package com.ssafy.koala.controller.chat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.koala.dto.chat.MessageDto;
import com.ssafy.koala.dto.chat.SocketMessageDto;
import com.ssafy.koala.model.chat.ChatroomModel;
import com.ssafy.koala.model.chat.MessageModel;
import com.ssafy.koala.service.chat.ChatService;
import com.ssafy.koala.service.chat.ChatroomService;
import com.ssafy.koala.service.chat.MessageService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Controller
public class WebChatController {
    private final Map<String, String> sessionUserMap = new HashMap<>();
    private final MessageService messageService;
    private final ChatroomService chatroomService;
    private final ChatService chatService;
    public WebChatController(MessageService messageService, ChatroomService chatroomService, ChatService chatService) {

        this.messageService = messageService;
        this.chatroomService = chatroomService;
        this.chatService = chatService;

        //chatSocket();
    }

    @PostMapping("/socket/message")
    public ResponseEntity<String> receiveMessage(@RequestBody SocketMessageDto clientMessage) {
        //System.out.println(clientMessage);
        if (clientMessage.getRoomId() == -1) {  //최초 로그인
            sessionUserMap.put(clientMessage.getSessionId(), "init");
        } else if (clientMessage.getRoomId() == -2) {  //세션 종료 -> 마지막 메시지 저장 필요
            //System.out.println(sessionUserMap.get(clientMessage.getSessionId()));
            chatService.updateLastId(sessionUserMap.get(clientMessage.getSessionId())); // 마지막 메시지 저장

            sessionUserMap.remove(clientMessage.getSessionId());
        } else {
            if (sessionUserMap.get(clientMessage.getSessionId()).equals("init")) { //이후 메시지 올 경우, sessionId -> nickname 맵핑
                sessionUserMap.replace(clientMessage.getSessionId(), clientMessage.getNickname());
            }
            ChatroomModel chatroom = chatroomService.getChatroomById(clientMessage.getRoomId());
            MessageModel messageModel = new MessageModel();
            BeanUtils.copyProperties(clientMessage, messageModel);
            messageModel.setChatroom(chatroom);
            messageModel.setDate(LocalDateTime.now());
            messageService.saveMessage(messageModel);
        }

        return ResponseEntity.ok("Response");
    }

}
