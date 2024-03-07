package com.ssafy.koala.controller.chat;

import com.ssafy.koala.dto.chat.MessageDto;
import com.ssafy.koala.model.chat.ChatroomModel;
import com.ssafy.koala.model.chat.MessageModel;
import com.ssafy.koala.service.chat.ChatroomService;
import com.ssafy.koala.service.chat.MessageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/message")
@Tag(name="message", description="message controller")
public class MessageController {
    private final MessageService messageService;
    private final ChatroomService chatroomService;
    public MessageController(MessageService messageService, ChatroomService chatroomService) {
        this.messageService = messageService;
        this.chatroomService = chatroomService;
    }

    @PostMapping("/enter")
    public ResponseEntity<List<MessageDto>> getMeesagesByRoomId(@RequestBody long roomId) {
        List<MessageDto> list = messageService.getMessagesByRoomId(roomId);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PostMapping("/write/{roomId}")
    public ResponseEntity<MessageDto> writeMessage(@PathVariable long roomId, @RequestBody MessageDto messageDto) {
        ChatroomModel chatroom = chatroomService.getChatroomById(roomId);
        MessageModel messageModel = new MessageModel();
        BeanUtils.copyProperties(messageDto,messageModel);
        messageModel.setChatroom(chatroom);
        messageService.saveMessage(messageModel);

        MessageDto result = new MessageDto();
        BeanUtils.copyProperties(messageModel,result);
        return new ResponseEntity<>(result,HttpStatus.OK);
    }
}
