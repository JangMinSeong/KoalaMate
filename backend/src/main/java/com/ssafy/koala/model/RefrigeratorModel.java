package com.ssafy.koala.model;

import com.ssafy.koala.model.user.UserModel;
import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class RefrigeratorModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "refrigerator_id")
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private UserModel user;

    private int refrigeratorType = 1;

    private String color = "#ffffff";

    @OneToMany(mappedBy = "refrigerator")
    private List<CustomobjModel> customobjModels;

//    @OneToMany(mappedBy = "refrigerator")
//    private List<RefrigeratorCustomobjModel> refrigeratorCustomobjs;

    @OneToMany(mappedBy = "refrigerator")
    private List<RefrigeratorDrinkModel> refrigeratorDrinkModels;



}
