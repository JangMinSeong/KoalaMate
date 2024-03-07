package com.ssafy.koala.repository.chat;

import com.ssafy.koala.model.chat.ChatModel;
import com.ssafy.koala.model.chat.ChatroomModel;
import com.ssafy.koala.model.chat.MessageModel;
import com.ssafy.koala.model.user.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatRepository extends JpaRepository<ChatModel, Long> {
    void deleteByUserEmailAndChatroomId(String userEmail, long chatroomId);
    List<ChatModel> findByUserId(long id);

    List<ChatModel> findByChatroomId(long id);

    @Modifying
    @Query("UPDATE ChatModel c " +
            "SET c.lastId = (SELECT MAX(m.id) FROM MessageModel m WHERE m.chatroom.id = c.chatroom.id) " +
            "WHERE c.user.nickname = :userNickname")
    void updateLastIdForChatByUserNickname(@Param("userNickname") String userNickname);
}
