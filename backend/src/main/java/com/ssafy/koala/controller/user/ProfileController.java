package com.ssafy.koala.controller.user;

import com.ssafy.koala.dto.file.StoreFileDto;
import com.ssafy.koala.dto.file.UploadFileResponse;
import com.ssafy.koala.dto.user.ProfileDto;
import com.ssafy.koala.dto.user.ProfileModifyDto;
import com.ssafy.koala.dto.user.UserDto;
import com.ssafy.koala.service.AuthService;
import com.ssafy.koala.service.file.FileStorageService;
import com.ssafy.koala.service.user.ProfileService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    private final ProfileService profileService;
    private final AuthService authService;
    private final FileStorageService fileStorageService;
    public ProfileController(AuthService authService, ProfileService profileService, FileStorageService fileStorageService) {
        this.profileService = profileService;
        this.authService = authService;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ProfileDto> getProfileByUserId(@PathVariable Long userId) {
        return profileService.getProfileDtoByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/modify")
    public ResponseEntity<String> modifyProfile(
            HttpServletRequest request,
            @RequestBody ProfileModifyDto modifiedProfile) {

        //System.out.println("Controller의 modifyProfile 메서드 호출 확인");

        String accessToken = authService.getAccessToken(request);
        UserDto userDto = authService.extractUserFromToken(accessToken);
        Long userId = userDto.getId(); // UserDto에서 id를 가져와야 함

        boolean result = profileService.modifyProfile(userId, modifiedProfile);
       // System.out.println("프로필 서비스의 modifyProfile 메서드 실행 !");
        if (result) {
            return ResponseEntity.ok("프로필이 성공적으로 수정되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("프로필 수정에 실패했습니다.");
        }
    }


    @PutMapping("/uploadProfileImage")
    public ResponseEntity<String> uploadProfileImage(
            HttpServletRequest request,
            @RequestParam("file") MultipartFile file) {

        String accessToken = authService.getAccessToken(request);
        UserDto userDto = authService.extractUserFromToken(accessToken);
        Long userId = userDto.getId(); // UserDto에서 id를 가져와야 함

        // 여기에 파일 업로드 및 경로 저장 로직 추가
        String ProfileImageUploadDir = "frontend/public/ProfileFileUploads"; // 파일 저장 경로
        String ProfileImgUrl = "ProfileFileUploads"; // 불러올 이미지 url 경로
        boolean result = profileService.uploadProfileImage(userId, file, ProfileImageUploadDir, ProfileImgUrl);

        if (result) {
            return ResponseEntity.ok("프로필 이미지가 성공적으로 업로드되었습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("프로필 이미지 업로드에 실패했습니다.");
        }
    }

    // 백 서버에 파일 업로드
    @PostMapping(value="/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        StoreFileDto storedFile = fileStorageService.storeFile(file, "profile");
        String fileName = storedFile.getFilename();

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/profile/download/")
                .path(fileName)
                .toUriString();

        return ResponseEntity.ok(new UploadFileResponse(storedFile.getId(), fileName, fileDownloadUri, file.getContentType(), file.getSize()));
    }

    // 백 서버에서 파일 다운로드
    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        // Load file as Resource
        Resource resource = fileStorageService.loadFileAsResource(fileName, "profile");

        return ResponseEntity.ok()
                .body(resource);
    }
}