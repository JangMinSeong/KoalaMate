package com.ssafy.koala.model;


import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class CustomobjModel {

    @Id
    @Column(name = "customobj_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String src;
    private double posX;
    private double posY;

    @ManyToOne
    @JoinColumn(name = "refrigerator_id")
    private RefrigeratorModel refrigerator;


//    @OneToMany(mappedBy = "customobj")
//    private List<RefrigeratorCustomobjModel> refrigeratorCustomobjModels;

}
