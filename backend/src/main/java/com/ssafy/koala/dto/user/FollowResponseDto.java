package com.ssafy.koala.dto.user;

import com.ssafy.koala.model.user.UserModel;
import lombok.Data;

import java.util.List;

@Data
public class FollowResponseDto {
    private long followCnt; // 사람 수
    private List<UserListDto> list; // 팔로우 or 팔로워 리스트

    private long id;
    private String nickname;

}
