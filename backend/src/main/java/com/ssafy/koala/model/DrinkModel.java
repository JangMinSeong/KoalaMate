package com.ssafy.koala.model;

import com.ssafy.koala.model.file.FileMetadata;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
public class DrinkModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private int category;
    private String image;
    private String label;


    @OneToMany(mappedBy = "drink", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<CocktailModel> cocktails = new ArrayList<>();

    @OneToMany(mappedBy = "drink")
    private List<RefrigeratorDrinkModel> refrigeratorDrinkModels;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "file_metadata_id")
    private FileMetadata fileMetadata;

}
