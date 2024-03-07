package com.ssafy.koala.dto.user;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDto {
    private String nickname;
    private int birthRange;
    private String gender;
    private String profile;
    private String introduction;
    private double alcoholLimitBottle;
    private double alcoholLimitGlass;
    private double mannersScore;
    private List<String> tags;
}
