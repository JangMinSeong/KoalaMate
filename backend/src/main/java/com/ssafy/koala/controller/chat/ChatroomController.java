package com.ssafy.koala.controller.chat;

import com.ssafy.koala.dto.chat.ChatroomDto;
import com.ssafy.koala.dto.chat.ChatroomResponseDto;
import com.ssafy.koala.dto.chat.RequestDto;
import com.ssafy.koala.dto.chat.createRequestDto;
import com.ssafy.koala.service.AuthService;
import com.ssafy.koala.service.chat.ChatService;
import com.ssafy.koala.service.chat.ChatroomService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/chatroom")
@Tag(name="chatroom", description="chatroom controller")
public class ChatroomController {
    private final ChatroomService chatroomService;
    private final ChatService chatService;
    private final AuthService authService;
    public ChatroomController (ChatroomService chatroomService, ChatService chatService, AuthService authService) {
        this.chatroomService = chatroomService;
        this.chatService = chatService;
        this.authService = authService;
    }

    @PostMapping("/createRoom")
    public ResponseEntity<ChatroomResponseDto> createRoom(@RequestBody createRequestDto requestDto, HttpServletRequest request) {
        String accessToken = authService.getAccessToken(request);
        String email = authService.extractUserFromToken(accessToken).getEmail();

        String otherUserEmail = requestDto.getOtherUserEmail();
        //System.out.println(otherUserEmail);

        ChatroomResponseDto chatroom = chatroomService.createRoom(email, otherUserEmail);

        return new ResponseEntity<>(chatroom,HttpStatus.OK);
    }

    @PostMapping("/roomlist")
    public ResponseEntity<List<ChatroomResponseDto>> getChatroomByUserId(HttpServletRequest request) {
        //System.out.println("getChatroomByUserId");
        String accessToken = authService.getAccessToken(request);
        //System.out.println(accessToken);
        long id = authService.extractUserFromToken(accessToken).getId();
        List<ChatroomResponseDto> list = chatService.getChatroomByUserId(id);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PostMapping("/leave")
    public Object leaveChatroomByUserIdAndChatroomId(@RequestBody long roomId, HttpServletRequest request) {
        String accessToken = authService.getAccessToken(request);
        String email = authService.extractUserFromToken(accessToken).getEmail();
        chatService.removeUserFromChatroom(email, roomId);
        return new ResponseEntity<>(null,HttpStatus.OK);
    }

    @PostMapping("/invite")
    public ResponseEntity<ChatroomResponseDto> inviteUser(@RequestBody RequestDto requestDto) {

        chatroomService.addUserToChatroom(requestDto.getUserEmail(),requestDto.getChatroomId());

        return new ResponseEntity<>(null,HttpStatus.OK);
    }
}
