package com.ssafy.koala.model;

import com.ssafy.koala.model.user.UserModel;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class LikeModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private BoardModel board;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private UserModel user;
}
