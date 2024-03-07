package com.ssafy.koala.dto;

import com.ssafy.koala.model.RefrigeratorDrinkModel;
import lombok.Data;

@Data
public class RefrigeratorDrinkDTO {

    private Long id;
    private Long refrigeratorId;
    private Long drinkId;
    private int posIdx;

    public static RefrigeratorDrinkDTO fromEntity(RefrigeratorDrinkModel refrigeratorDrinkModel) {
        RefrigeratorDrinkDTO dto = new RefrigeratorDrinkDTO();
        dto.setId(refrigeratorDrinkModel.getId());
        dto.setRefrigeratorId(refrigeratorDrinkModel.getRefrigerator().getId());
        dto.setDrinkId(refrigeratorDrinkModel.getDrink().getId());
        dto.setPosIdx(refrigeratorDrinkModel.getPosIdx());
        return dto;
    }
}
