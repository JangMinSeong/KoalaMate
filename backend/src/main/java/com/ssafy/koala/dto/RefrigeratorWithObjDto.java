package com.ssafy.koala.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class RefrigeratorWithObjDto {
    private RefrigeratorDTO refrigerator;
    private List<CustomobjDto> objs;
}
