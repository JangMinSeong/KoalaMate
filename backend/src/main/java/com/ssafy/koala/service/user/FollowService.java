package com.ssafy.koala.service.user;

import com.ssafy.koala.dto.user.UserListDto;
import com.ssafy.koala.model.user.FollowModel;
import com.ssafy.koala.model.user.UserModel;
import com.ssafy.koala.repository.FollowRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class FollowService {
    private FollowRepository followRepository;

    // 해당 uid의 유저를 팔로우하는 유저 리스트
    public List<UserListDto> findFollowerById(long userId) {
        // 유저를(userId) 팔로우하는 유저들의 리스트를 가져옴
        List<FollowModel> followers = followRepository.findFollowerByFollowee_Id(userId);
        // 각각의 FollowModel에서 follower를 추출하여 List<UserModel>으로 변환
        List<UserModel> followerUsers = followers.stream()
                .map(FollowModel::getFollower)
                .collect(Collectors.toList());
        // followerUsers를 List<UserListDto>로 바꾸기
        List<UserListDto> result = convertToListDto(followerUsers);

        return result;
    }

    // 해당 uid의 유저가 팔로우 하는 유저 리스트
    public List<UserListDto> findFolloweeById(Long userId) {
        // 유저가(userId) 팔로우하는 유저들의 리스트를 가져옴
        List<FollowModel> followees = followRepository.findFolloweeByFollower_Id(userId);
        // 각각의 FollowModel에서 followee를 추출하여 List<UserModel>으로 변환
        List<UserModel> followeeUsers = followees.stream()
                .map(FollowModel::getFollowee)
                .collect(Collectors.toList());
        // followeeUsers를 List<UserListDto>로 바꾸기
        List<UserListDto> result = convertToListDto(followeeUsers);

        return result;
    }

    // 해당 uid의 유저 팔로워 수
    public Long countByFollower_Id(Long userId) {
        return followRepository.countByFollowee_Id(userId);
    }

    // 해당 uid의 유저가 팔로우 하는 수
    public Long countByFollowee_Id(Long userId) {
        return followRepository.countByFollower_Id(userId);
    }

    // 유저 팔로우하기
    public void followUser(Long myId, Long userId) {
        FollowModel follow = new FollowModel();

        UserModel follower = new UserModel();
        follower.setId(myId);
        UserModel followee = new UserModel();
        followee.setId(userId);

        follow.setFollowee(followee);
        follow.setFollower(follower);
        followRepository.save(follow);
    }

    // 유저 언팔로우하기
    @Transactional
    public void unfollowUser(Long myId, Long userId) {
        FollowModel follow = new FollowModel();

        UserModel follower = new UserModel();
        follower.setId(myId);
        UserModel followee = new UserModel();
        followee.setId(userId);

        follow.setFollowee(followee);
        follow.setFollower(follower);
        followRepository.deleteByFollowerAndFollowee(follower, followee);
    }

    // 사용자가 상대를 팔로우 중인지 확인. 팔로우 하고있으면 true
    public boolean checkFollow(Long myId, Long userId) {
        UserModel follower = new UserModel();
        UserModel followee = new UserModel();
        follower.setId(myId);
        followee.setId(userId);
        return followRepository.existsByFollowerAndFollowee(follower, followee);
    }


    // List 타입 바꾸기
    List<UserListDto> convertToListDto(List<UserModel> list) {
        List<UserListDto> result = new ArrayList<>();
        for(UserModel um : list) {
            UserListDto dto = new UserListDto();
            dto.setId(um.getId());
            dto.setEmail(um.getEmail());
            dto.setNickname(um.getNickname());
            dto.setBirthRange(um.getBirthRange());
            dto.setGender(um.getGender());
            dto.setProfile(um.getProfile());
            dto.setIntroduction(um.getIntroduction());
            result.add(dto);
        }
        return result;
    }
}
