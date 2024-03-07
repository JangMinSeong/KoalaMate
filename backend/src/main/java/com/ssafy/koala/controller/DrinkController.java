package com.ssafy.koala.controller;

import com.ssafy.koala.dto.cocktail.CocktailWithBoardDto;
import com.ssafy.koala.dto.drink.DrinkDto;
import com.ssafy.koala.dto.drink.DrinkWithoutCocktailDto;
import com.ssafy.koala.dto.file.StoreFileDto;
import com.ssafy.koala.dto.file.UploadFileResponse;
import com.ssafy.koala.model.DrinkModel;
import com.ssafy.koala.repository.LikeRepository;
import com.ssafy.koala.service.AuthService;
import com.ssafy.koala.service.DrinkService;
import com.ssafy.koala.service.file.FileStorageService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/drink")
@Tag(name="drink", description="drink controller")
public class DrinkController {
    private final DrinkService drinkService;
    private final AuthService authService;
    private final LikeRepository likeRepository;
    private final FileStorageService fileStorageService;

    public DrinkController(DrinkService drinkService, AuthService authService, LikeRepository likeRepository, FileStorageService fileStorageService) {
        this.drinkService = drinkService;
        this.authService = authService;
        this.likeRepository = likeRepository;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/{drink_id}")
    public Object getDrink(@PathVariable long drink_id, HttpServletRequest request) {
        DrinkDto drinkDto = drinkService.getDrinkById(drink_id);
        if(drinkDto == null) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }

        boolean isLogin = false;
        String accessToken = null;
        try {
            accessToken = authService.getAccessToken(request);
            isLogin = true;
        }
        catch(BadCredentialsException e) {
            isLogin = false;
        }
        if(isLogin) {
            long userId = authService.extractUserFromToken(accessToken).getId();
            for(CocktailWithBoardDto cocktail : drinkDto.getCocktails()) {
                if(likeRepository.existsByUserIdAndBoardId(userId,cocktail.getBoard().getId()))
                    cocktail.getBoard().setLike(true);
            }
        }

        return new ResponseEntity<>(drinkDto,HttpStatus.OK);
    }

    @PostMapping("/write")
    public Object createDrink(@RequestBody DrinkWithoutCocktailDto drinkDto) {
        DrinkModel drinkModel = drinkService.createDrink(drinkDto);

        return new ResponseEntity<>(drinkModel, HttpStatus.OK);
    }

    @PostMapping("/search/category")
    public Object searchDrinkByCategory(@RequestBody int category) {
        List<DrinkDto> drinks = drinkService.getDrinkByCategory(category);

        return new ResponseEntity<>(drinks, HttpStatus.OK);
    }

    @GetMapping("/search")
    public Object searchDrinkByName(@RequestParam String name) {
        List<DrinkDto> drinks = drinkService.getDrinkByName(name);
        return new ResponseEntity<>(drinks, HttpStatus.OK);
    }

    // 백 서버에 파일 업로드
    @PostMapping(value="/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        StoreFileDto storedFile = fileStorageService.storeFile(file, "drink");
        String fileName = storedFile.getFilename();

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/drink/download/")
                .path(fileName)
                .toUriString();

        return ResponseEntity.ok(new UploadFileResponse(storedFile.getId(), fileName, fileDownloadUri, file.getContentType(), file.getSize()));
    }

    // 백 서버에서 파일 다운로드
    @GetMapping("/download/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
        // Load file as Resource
        Resource resource = fileStorageService.loadFileAsResource(fileName, "drink");

        return ResponseEntity.ok()
                .body(resource);
    }
}
