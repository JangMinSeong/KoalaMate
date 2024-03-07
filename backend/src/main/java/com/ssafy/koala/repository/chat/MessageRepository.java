package com.ssafy.koala.repository.chat;

import com.ssafy.koala.model.chat.MessageModel;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<MessageModel,Long> {
    List<MessageModel> findTop50ByChatroomIdOrderByIdDesc(long id);
}

