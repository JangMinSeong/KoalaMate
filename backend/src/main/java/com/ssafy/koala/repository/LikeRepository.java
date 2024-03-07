package com.ssafy.koala.repository;

import com.ssafy.koala.model.BoardModel;
import com.ssafy.koala.model.LikeModel;
import com.ssafy.koala.model.user.UserModel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LikeRepository extends JpaRepository<LikeModel, Long> {
    boolean existsByUserAndBoard(UserModel user, BoardModel board);

    boolean existsByUserIdAndBoardId(Long userId, Long boardId);

    @Transactional
    void deleteByUserAndBoard(UserModel user, BoardModel board);

    long countByBoard_Id(Long boardId);

    @Query("SELECT l.board.id FROM LikeModel l WHERE l.user.id = :userId")
    List<Long> findLikedBoardIdsByUserId(@Param("userId") Long userId);


    @Query("select count(l) from LikeModel l where l.user.id = :userId and l.board.id in (select l2.board.id from LikeModel l2 where l2.user.id = :otherId)")
    int existsCommonBoardIdForUsers(@Param("userId") Long userId, @Param("otherId") Long otherId);

    @Query("SELECT l.board.id FROM LikeModel l WHERE l.user.id = :userId")
    List<Long> findAllLikedBoardIdsByUserId(@Param("userId") Long userId);}
