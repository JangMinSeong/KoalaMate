package com.ssafy.koala.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileModifyDto {
    private String nickname;
    private int birthRange;
    private String gender;
    private String profile;
    private String introduction;
    private double alcoholLimitBottle;
    private double alcoholLimitGlass;
    private List<String> tags;
    private double latitude;
    private double longitude;
    private Long fileId;
}
