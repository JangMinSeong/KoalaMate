package com.ssafy.koala.dto.user;

import lombok.Data;

// 유저 리스트를 출력하기 위한 간단한 정보
@Data
public class UserListDto {
    private long id;
    private String email;
    private String nickname;
    private int birthRange;
    private String gender;
    private String profile;
    private String introduction;
}
