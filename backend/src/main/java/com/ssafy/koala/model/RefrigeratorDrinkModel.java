package com.ssafy.koala.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class RefrigeratorDrinkModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "refrigerator_id")
    private RefrigeratorModel refrigerator;

    @ManyToOne
    @JoinColumn(name = "drink_id")
    private DrinkModel drink;

    private int posIdx;

}
