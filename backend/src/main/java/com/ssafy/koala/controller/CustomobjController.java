package com.ssafy.koala.controller;

import com.ssafy.koala.dto.CustomobjDto;
import com.ssafy.koala.service.CustomobjService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customobj")
public class CustomobjController {

    private final CustomobjService customobjService;

    public CustomobjController(CustomobjService customobjService) {
        this.customobjService = customobjService;
    }

    @Operation(summary = "Get custom object by ID")
    @GetMapping("/{id}")
    public ResponseEntity<CustomobjDto> getCustomobjById(
            @Parameter(description = "ID of custom object to be searched", required = true)
            @PathVariable Long id) {
        CustomobjDto customobjDto = customobjService.getCustomobjById(id);
        return new ResponseEntity<>(customobjDto, HttpStatus.OK);
    }

    @Operation(summary = "Add a new custom object")
    @PostMapping("/add")
    public ResponseEntity<CustomobjDto> addCustomobj(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Custom object to be added",
                    required = true,
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            schema = @Schema(implementation = CustomobjDto.class)
                    )
            )
            @RequestBody CustomobjDto customobjDto) {
        CustomobjDto addedCustomobj = customobjService.addCustomobj(customobjDto);
        return new ResponseEntity<>(addedCustomobj, HttpStatus.CREATED);
    }
}
