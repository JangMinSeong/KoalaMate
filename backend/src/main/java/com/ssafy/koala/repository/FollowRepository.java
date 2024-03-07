package com.ssafy.koala.repository;

import com.ssafy.koala.model.user.FollowModel;
import com.ssafy.koala.model.user.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FollowRepository extends JpaRepository<FollowModel, Long> {

    // 유저가 팔로우 하는 유저 수
    Long countByFollower_Id(Long follower);

    // 유저의 팔로워 수
    Long countByFollowee_Id(Long followee);

    // 유저가 팔로우 하는 사람들의 관계 리스트
    List<FollowModel> findFolloweeByFollower_Id(Long follower);

    // 유저를 팔로우 하는 사람들의 관계 리스트
    List<FollowModel> findFollowerByFollowee_Id(Long followee);

    // 언팔로우
    void deleteByFollowerAndFollowee(UserModel followerId, UserModel followeeId);

    // 사용자가 상대를 팔로우 중인지 확인
    boolean existsByFollowerAndFollowee(UserModel follower, UserModel followee);
}
