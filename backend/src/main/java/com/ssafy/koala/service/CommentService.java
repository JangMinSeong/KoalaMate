package com.ssafy.koala.service;

import com.ssafy.koala.dto.CommentDto;
import com.ssafy.koala.model.CommentModel;
import com.ssafy.koala.repository.CommentRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommentService {
    private final CommentRepository commentRepository;

    public CommentService (CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    // 댓글 생성
    public CommentModel createComment(CommentModel comment) {
        return commentRepository.save(comment);
    }

    // 댓글 조회
    public CommentModel getCommentById(long commentId) {
        Optional<CommentModel> commentOptional = commentRepository.findById(commentId);
        return commentOptional.orElse(null);
    }
    ;


    // 댓글 업데이트
    public CommentModel updateComment(long commentId, CommentDto updatedComment) {
        Optional<CommentModel> existingCommentOptional = commentRepository.findById(commentId);

        if (existingCommentOptional.isPresent()) {
            CommentModel existingComment = existingCommentOptional.get();
            existingComment.setContent(updatedComment.getContent());
            // 기타 필드 업데이트

            return commentRepository.save(existingComment);
        }
        return null;
    }
    // 댓글 삭제
    public void deleteComment(long commentId) {
        commentRepository.deleteById(commentId);
    }

    public CommentDto convertToDto(CommentModel comment) {
        CommentDto commentDto = new CommentDto();
        BeanUtils.copyProperties(comment, commentDto);
        return commentDto;
    }

    public CommentModel convertToBoard(CommentDto commentDto) {
        CommentModel comment = new CommentModel();
        BeanUtils.copyProperties(commentDto, comment);
        return comment;
    }
}
