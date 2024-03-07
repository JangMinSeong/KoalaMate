//package com.ssafy.koala.controller.file;
//
//import com.ssafy.koala.dto.file.StoreFileDto;
//import com.ssafy.koala.dto.file.UploadFileResponse;
//import com.ssafy.koala.model.file.FileMetadata;
//import com.ssafy.koala.service.file.FileStorageService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.core.io.Resource;
//import org.springframework.http.MediaType;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
//
//@RestController
//@RequestMapping("/api/files")
//public class FileUploadController {
//
//    private final FileStorageService fileStorageService;
//
//    @Autowired
//    public FileUploadController(FileStorageService fileStorageService) {
//        this.fileStorageService = fileStorageService;
//    }
//
//    @PostMapping(value="/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
//        StoreFileDto storedFile = fileStorageService.storeFile(file);
//        String fileName = storedFile.getFilename();
//
//        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
//                .path("/api/files/download/")
//                .path(fileName)
//                .toUriString();
//
//        return ResponseEntity.ok(new UploadFileResponse(storedFile.getId(), fileName, fileDownloadUri, file.getContentType(), file.getSize()));
//    }
//
//    @GetMapping("/download/{fileName:.+}")
//    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
//        // Load file as Resource
//        Resource resource = fileStorageService.loadFileAsResource(fileName);
//
//        return ResponseEntity.ok()
//                .body(resource);
//    }
//}
