package com.ssafy.koala.service.chat;

import com.ssafy.koala.dto.chat.ChatroomDto;
import com.ssafy.koala.dto.chat.ChatroomResponseDto;
import com.ssafy.koala.dto.chat.MessageDto;
import com.ssafy.koala.dto.user.UserListDto;
import com.ssafy.koala.model.chat.ChatModel;
import com.ssafy.koala.model.chat.ChatroomModel;
import com.ssafy.koala.model.user.UserModel;
import com.ssafy.koala.repository.UserRepository;
import com.ssafy.koala.repository.chat.ChatRepository;
import com.ssafy.koala.repository.chat.ChatroomRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ChatroomService {
    private final ChatroomRepository chatroomRepository;
    private final UserRepository userRepository;
    private final ChatRepository chatRepository;

    public ChatroomResponseDto createRoom(String user1_email, String user2_email) {
        Optional<UserModel> user1 = userRepository.findByEmail(user1_email);
        Optional<UserModel> user2 = userRepository.findByEmail(user2_email);

        ChatroomModel chatroom = chatroomRepository.save(new ChatroomModel());

        List<ChatModel> chatModels = new ArrayList<>();

        ChatModel chat1 = new ChatModel();
        chat1.setChatroom(chatroom);
        chat1.setUser(user1.orElseThrow());
        chatModels.add(chat1);

        ChatModel chat2 = new ChatModel();
        chat2.setChatroom(chatroom);
        chat2.setUser(user2.orElseThrow());
        chatModels.add(chat2);

        chatRepository.saveAll(chatModels);

        ChatroomResponseDto result = new ChatroomResponseDto();
        BeanUtils.copyProperties(chatroom, result);

        result.setConfirmMessageId(0);
        MessageDto initMessage = new MessageDto();
        initMessage.setId(-1);
        initMessage.setNickname(user1.get().getNickname());
        initMessage.setContent("초대합니다");
        result.setLastMessage(initMessage);
        List<UserListDto> users = new ArrayList<>();

        UserListDto userDto1 = new UserListDto();
        BeanUtils.copyProperties(user1.get(),userDto1);
        UserListDto userDto2 = new UserListDto();
        BeanUtils.copyProperties(user2.get(),userDto2);
        users.add(userDto1);
        users.add(userDto2);

        result.setUsers(users);

        return result;
    }

    public ChatroomModel getChatroomById(long id) {
        return chatroomRepository.findById(id).orElseThrow();
    }

    public void addUserToChatroom(String email, long roomId) {
        ChatModel chat = new ChatModel();
        UserModel user = userRepository.findByEmail(email).orElseThrow();
        ChatroomModel chatroom = chatroomRepository.findById(roomId).orElseThrow();
        chat.setUser(user);
        chat.setChatroom(chatroom);

        chatRepository.save(chat);
    }
}
