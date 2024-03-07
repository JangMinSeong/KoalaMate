package com.ssafy.koala.controller;

import com.ssafy.koala.dto.LocationDto;
import com.ssafy.koala.dto.user.UserDto;
import com.ssafy.koala.service.AuthService;
import com.ssafy.koala.service.user.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/findmate")
@Tag(name="findmate", description="findmate controller")
public class FindMateController {
    private final UserService userService;
    private final AuthService authService;

    // 친구 찾기 페이지를 접속할 때 자신의 위치 정보 갱신
    @PutMapping("/save-location")
    public ResponseEntity<?> saveLocation(@RequestBody LocationDto location, HttpServletRequest request) {
        try {
            String accessToken = authService.getAccessToken(request);
            UserDto dto = authService.extractUserFromToken(accessToken);

            userService.saveLocation(dto.getId(), location.getLatitude(), location.getLongitude());
            return new ResponseEntity<>("save location success.", HttpStatus.OK);
        } catch(EmptyResultDataAccessException e) {
            return new ResponseEntity<>("user not found.", HttpStatus.NOT_FOUND);
        } catch(Exception e) {
            return new ResponseEntity<>("error save location", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 상대방의 유저 정보, 음료 정보, 팔로우 정보 반환
    @GetMapping("/listMate")
    public ResponseEntity<?> getUserList(HttpServletRequest request) {
        String accessToken = authService.getAccessToken(request);
        UserDto user = authService.extractUserFromToken(accessToken);

        return new ResponseEntity<>(userService.findAllUser(user.getId()), HttpStatus.OK);
    }

}
