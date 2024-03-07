package com.ssafy.koala.dto.user;

import com.ssafy.koala.model.user.UserModel;
import lombok.Data;

@Data
public class FollowDto {
    private Long followId;
    private UserModel follower;

    private UserModel followee;

}
