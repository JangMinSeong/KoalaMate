package com.ssafy.koala.controller;

import com.ssafy.koala.dto.board.BoardDto;
import com.ssafy.koala.dto.CommentDto;
import com.ssafy.koala.model.CommentModel;
import com.ssafy.koala.service.BoardService;
import com.ssafy.koala.service.CommentService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/comment")
@Tag(name="comment", description="comment controller")
public class CommentController {
    private final CommentService commentService;
    private final BoardService boardService;

    public CommentController(CommentService commentService, BoardService boardService) {
        this.commentService = commentService;
        this.boardService = boardService;
    }

    // 댓글 생성
    @PostMapping("/{board_id}/write")
    public ResponseEntity<CommentModel> createComment(@PathVariable long board_id, @RequestBody CommentDto commentDto) {
        CommentModel comment = new CommentModel();
        comment.setNickname(commentDto.getNickname());
        comment.setContent(commentDto.getContent());

        //System.out.println(board_id + " " + comment.getContent());

        BoardDto board = boardService.getBoardDtoById(board_id);

        comment.setBoard(boardService.convertToBoard(board));

        return new ResponseEntity<>(commentService.createComment(comment), HttpStatus.CREATED);
    }

    // 댓글 조회
    @GetMapping("/{commentId}")
    public ResponseEntity<CommentModel> getCommentById(@PathVariable long commentId) {
       // System.out.println(commentId);
        CommentModel comment = commentService.getCommentById(commentId);
        //System.out.println(comment.getContent());
        if (comment != null) {
            return new ResponseEntity<>(comment, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 댓글 업데이트
    @PutMapping("/{commentId}/modify")
    public ResponseEntity<CommentModel> updateComment(
            @PathVariable long commentId,
            @RequestBody CommentDto updatedComment
    ) {

        CommentModel updated = commentService.updateComment(commentId, updatedComment);
        if (updated != null) {
            return new ResponseEntity<>(updated, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}/delete")
    public ResponseEntity<Void> deleteComment(@PathVariable long commentId) {
        commentService.deleteComment(commentId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
