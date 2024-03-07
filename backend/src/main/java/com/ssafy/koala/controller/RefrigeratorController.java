package com.ssafy.koala.controller;

import com.ssafy.koala.dto.*;
import com.ssafy.koala.dto.user.UserDto;
import com.ssafy.koala.service.AuthService;
import com.ssafy.koala.service.RefrigeratorService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/refrigerator")
public class RefrigeratorController {

    private final RefrigeratorService refrigeratorService;
    private final AuthService authService;


    @Autowired
    public RefrigeratorController(AuthService authService, RefrigeratorService refrigeratorService) {
        this.refrigeratorService = refrigeratorService;
        this.authService = authService;
    }


    // 냉장고 외부 조회
    @GetMapping("/{userId}")
    public ResponseEntity<RefrigeratorDTO> getRefrigerator(@PathVariable Long userId) {
        Optional<RefrigeratorDTO> refrigeratorDTO = refrigeratorService.getRefrigeratorByUserId(userId);
        return refrigeratorDTO.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 냉장고 외부 수정
    @PutMapping("/modify")
    public ResponseEntity<RefrigeratorDTO> modifyRefrigerator(
            @RequestBody RefrigeratorDTO updatedRefrigeratorDTO,
            HttpServletRequest request) {

        String accessToken = authService.getAccessToken(request);
        UserDto userDto = authService.extractUserFromToken(accessToken);
        Long userId = userDto.getId(); // UserDto에서 id를 가져와야 함

        RefrigeratorDTO modifiedRefrigerator = refrigeratorService.modifyRefrigeratorByUserId(userId, updatedRefrigeratorDTO);
        return modifiedRefrigerator != null ? ResponseEntity.ok(modifiedRefrigerator) : ResponseEntity.notFound().build();
    }

//    // 냉장고 내용물(Drinks) 확인
//    @GetMapping("/{userId}/open")
//    public ResponseEntity<List<RefrigeratorCustomobjDTO>> getRefrigeratorContents(@PathVariable Long userId) {
//        List<RefrigeratorCustomobjDTO> customobjDTOs = refrigeratorService.getRefrigeratorContentsByUserId(userId);
//        return ResponseEntity.ok(customobjDTOs);
//    }

    // 냉장고 자석 수정
//    @PutMapping("/modifyCustoms")
//    public ResponseEntity<List<RefrigeratorCustomobjDTO>> modifyRefrigeratorContents(@RequestBody List<RefrigeratorCustomobjDTO> updatedContentsDTO, HttpServletRequest request) {
//
//        String accessToken = authService.getAccessToken(request);
//        UserDto userDto = authService.extractUserFromToken(accessToken);
//        Long userId = userDto.getId(); // UserDto에서 id를 가져와야 함
//
//        List<RefrigeratorCustomobjDTO> modifiedContents = refrigeratorService.modifyRefrigeratorContentsByUserId(userId, updatedContentsDTO);
//        return ResponseEntity.ok(modifiedContents);
//    }


    // 냉장고에 자석(custom objects) 추가(기존 오브젝트는 모두 삭제)
    @PutMapping("/addCustomobjs")
    public ResponseEntity<?> addCustomobjsToRefrigerator(
            @RequestBody List<CustomobjDto> customobjDTOs,
            HttpServletRequest request) {

        try {
            String accessToken = authService.getAccessToken(request);
            UserDto userDto = authService.extractUserFromToken(accessToken);
            Long userId = userDto.getId(); // UserDto에서 id를 가져와야 함

            boolean result = refrigeratorService.addCustomobjsToRefrigerator(userId, customobjDTOs);
            if(result)
                return new ResponseEntity<>("success add custom objs", HttpStatus.OK);
            else
                return new ResponseEntity<>("not found refrigerator", HttpStatus.NOT_FOUND);
        } catch(Exception e) {
            return new ResponseEntity<>("error processing add custom objs", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @Transactional
    @PutMapping("/addDrinks")
    public ResponseEntity<List<RefrigeratorDrinkDTO>> addDrinksToRefrigerator(
            @RequestBody List<Long> drinkIds,
            HttpServletRequest request) {


        String accessToken = authService.getAccessToken(request);
        UserDto userDto = authService.extractUserFromToken(accessToken);
        Long userId = userDto.getId(); // UserDto에서 id를 가져와야 함

        List<RefrigeratorDrinkDTO> modifiedRefrigeratorContents = refrigeratorService.addDrinksToRefrigerator(userId, drinkIds);
        //System.out.println(userId);
        return ResponseEntity.ok(modifiedRefrigeratorContents);
    }

    // 냉장고 정보와 해당하는 오브젝트 가져오기
    @GetMapping("/object/{userId}")
    public ResponseEntity<?> getObejcts(@PathVariable Long userId) {
        Optional<RefrigeratorDTO> refrigerator = refrigeratorService.getRefrigeratorByUserId(userId);
        if(refrigerator.isPresent()) {
            List<CustomobjDto> objs = refrigeratorService.getObjectsByRefrigeratorId(refrigerator.get().getId());
            return new ResponseEntity<>(new RefrigeratorWithObjDto(refrigerator.get(), objs), HttpStatus.OK);
        }
        return new ResponseEntity<>("not found refrigerator", HttpStatus.NOT_FOUND);
    }

    @GetMapping("/drink/{userId}")
    public ResponseEntity<?> getDrinks(@PathVariable Long userId) {
        List<RefrigeratorInsideDto> drinks = refrigeratorService.getDrinksByUserId(userId);
        return new ResponseEntity<>(drinks, HttpStatus.OK);
    }

}
