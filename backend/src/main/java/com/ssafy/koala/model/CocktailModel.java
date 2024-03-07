package com.ssafy.koala.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class CocktailModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double proportion;  //비율
    private String unit;  //단위


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id")
    private BoardModel board;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "drink_id")
    private DrinkModel drink;
}
