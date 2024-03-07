package com.ssafy.koala.repository.chat;

import com.ssafy.koala.model.chat.ChatroomModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatroomRepository extends JpaRepository<ChatroomModel,Long> {
}
