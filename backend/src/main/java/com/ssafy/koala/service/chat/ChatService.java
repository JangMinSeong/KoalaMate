package com.ssafy.koala.service.chat;

import com.ssafy.koala.dto.chat.ChatroomDto;
import com.ssafy.koala.dto.chat.ChatroomResponseDto;
import com.ssafy.koala.dto.chat.MessageDto;
import com.ssafy.koala.dto.user.UserListDto;
import com.ssafy.koala.model.chat.ChatModel;
import com.ssafy.koala.model.chat.ChatroomModel;
import com.ssafy.koala.model.chat.MessageModel;
import com.ssafy.koala.model.user.UserModel;
import com.ssafy.koala.repository.chat.ChatRepository;
import com.ssafy.koala.repository.chat.MessageRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatRepository chatRepository;

    public ChatService(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    @Transactional
    public void removeUserFromChatroom(String userEmail, long chatroomId) {
        chatRepository.deleteByUserEmailAndChatroomId(userEmail, chatroomId);
    }

    public List<ChatroomResponseDto> getChatroomByUserId(long id) {
        List<ChatModel> results = chatRepository.findByUserId(id);
        return results.stream()
                .map(temp -> {
                    ChatroomResponseDto insert = new ChatroomResponseDto();
                    insert.setTheme(temp.getTheme());
                    insert.setId(temp.getChatroom().getId());
                    insert.setActive(temp.getChatroom().isActive());
                    insert.setRoomName(temp.getChatroom().getRoomName());
                    insert.setConfirmMessageId(temp.getLastId());
                    insert.setUsers(getUserByChatroomId(temp.getChatroom().getId()));

                    int lastIdx = temp.getChatroom().getMessages().size() - 1;
                   // System.out.println("lastIdx " + lastIdx);
                    MessageDto message = null;
                    if(lastIdx >= 0) {
                        message = new MessageDto();
                        BeanUtils.copyProperties(temp.getChatroom().getMessages().get(lastIdx), message);
                    }
                    insert.setLastMessage(message);

                    return insert;
                })
                .collect(Collectors.toList());
    }


    public List<ChatModel> findByUserId(long id) {
        return chatRepository.findByUserId(id);
    }

    @Transactional
    public void updateLastId(String nickname) {
        chatRepository.updateLastIdForChatByUserNickname(nickname);
        // ChatRepository를 사용하여 Chat 엔티티를 업데이트합니다.

    }

    public List<UserListDto> getUserByChatroomId(long id) {
        List<ChatModel> results = chatRepository.findByChatroomId(id);

        return results.stream()
                .map(temp -> {
                    UserListDto insert = new UserListDto();
                    insert.setId(temp.getUser().getId());
                    insert.setEmail(temp.getUser().getEmail());
                    insert.setNickname(temp.getUser().getNickname());
                    insert.setGender(temp.getUser().getGender());
                    insert.setProfile(temp.getUser().getProfile());
                    insert.setBirthRange(temp.getUser().getBirthRange());
                    insert.setIntroduction(temp.getUser().getIntroduction());
                    return insert;
                })
                .collect(Collectors.toList());
    }
}
