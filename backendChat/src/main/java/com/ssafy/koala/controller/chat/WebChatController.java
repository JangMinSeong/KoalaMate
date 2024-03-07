package com.ssafy.koala.controller.chat;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.koala.dto.MessageDto;
import com.ssafy.koala.dto.NotificationDto;
import com.ssafy.koala.dto.SocketMessageDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.client.RestTemplate;

@Controller
public class WebChatController {
    @Autowired
    private static SimpMessagingTemplate messagingTemplate;
//    private final Socket socket;
//    public static PrintWriter writer;
      private ObjectMapper objectMapper;
    public WebChatController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
        this.objectMapper = new ObjectMapper();

//	    try {
//		    socket = new Socket("localhost", 7777);
//	        writer = new PrintWriter(socket.getOutputStream(), true);
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }
    }

    @MessageMapping("/notification/{nickname}")
    @SendTo("/topic/notification/{nickname}")
    public NotificationDto sendNotification(@DestinationVariable String nickname, NotificationDto notificationDto) {
        //System.out.println("notification " + nickname + " " + notificationDto.getRoomId());
        return notificationDto;
    }

    @MessageMapping("/messages/{roomId}")
    @SendTo("/topic/messages/{roomId}")
    public MessageDto sendMessage(SimpMessageHeaderAccessor headerAccessor, @DestinationVariable String roomId, MessageDto messageDto) throws JsonProcessingException {
        String sessionId = headerAccessor.getSessionId();


     //   System.out.println(roomId + " " + messageDto + " " + sessionId);

        SocketMessageDto sockMessageDto = new SocketMessageDto();
        sockMessageDto.setSessionId(sessionId);
        sockMessageDto.setContent(messageDto.getContent());
        sockMessageDto.setRoomId(Long.parseLong(roomId));
        sockMessageDto.setNickname(messageDto.getNickname());

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<SocketMessageDto> requestEntity = new HttpEntity<>(sockMessageDto, headers);
        ResponseEntity<String> responseEntity = restTemplate.exchange(
                "http://localhost:8085/socket/message",
                HttpMethod.POST,
                requestEntity,
                String.class
        );

        // 메시지를 받아서 "/topic/messages"에 있는 모든 구독자에게 브로드캐스트합니다.
        return messageDto;
    }
}
