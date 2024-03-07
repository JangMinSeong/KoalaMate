//package com.ssafy.koala.model;
//
//import jakarta.persistence.*;
//import lombok.Data;
//
//@Entity
//@Data
//public class RefrigeratorCustomobjModel {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @ManyToOne
//    @JoinColumn(name = "refrigerator_id")
//    private RefrigeratorModel refrigerator;
//
//    @ManyToOne
//    @JoinColumn(name = "customobj_id")
//    private CustomobjModel customobj;
//
//    private int posX;
//    private int posY;
//
//}
