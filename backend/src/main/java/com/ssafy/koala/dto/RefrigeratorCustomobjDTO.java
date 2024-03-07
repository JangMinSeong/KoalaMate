//package com.ssafy.koala.dto;
//
//
//import com.ssafy.koala.model.RefrigeratorCustomobjModel;
//import lombok.Data;
//
//@Data
//public class RefrigeratorCustomobjDTO {
//
//    private Long id;
//    private Long refrigeratorId;
//    private Long customobjId;
//
//    private int posX;
//    private int posY;
//
//    public static RefrigeratorCustomobjDTO fromEntity(RefrigeratorCustomobjModel refrigeratorCustomobjModel) {
//
//        RefrigeratorCustomobjDTO dto = new RefrigeratorCustomobjDTO();
//        dto.setId(refrigeratorCustomobjModel.getId());
//        dto.setRefrigeratorId(refrigeratorCustomobjModel.getRefrigerator().getId());
//        dto.setCustomobjId(refrigeratorCustomobjModel.getCustomobj().getId());
//        dto.setPosX(refrigeratorCustomobjModel.getPosX());
//        dto.setPosY(refrigeratorCustomobjModel.getPosY());
//
//        return dto;
//    }
//
//}
