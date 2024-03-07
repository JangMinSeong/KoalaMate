package com.ssafy.koala.service.file;

import com.ssafy.koala.dto.file.StoreFileDto;
import com.ssafy.koala.exception.file.FileStorageException;
import com.ssafy.koala.model.file.FileMetadata;
import com.ssafy.koala.repository.file.FileMetadataRepository;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class FileStorageService {

    private static final long MAX_FILE_SIZE = 1024 * 1024 * 100; // 100MB
    private static final List<String> SUPPORTED_FILE_TYPES;

    static {
        // 파일 저장을 지원하는 이미지 파일 확장자 목록
        List<String> imageTypes = new ArrayList<>();
        // 이미지 파일 확장자
        imageTypes.add("image/jpeg");
        imageTypes.add("image/jpg");
        imageTypes.add("image/png");
        imageTypes.add("image/gif");
        imageTypes.add("image/bmp");

        SUPPORTED_FILE_TYPES = Collections.unmodifiableList(imageTypes);
    }

    private final String uploadDir;
    private final FileMetadataRepository fileMetadataRepository;

    @Autowired
    public FileStorageService(@Value("${file.upload-dir}") String uploadDir, FileMetadataRepository fileMetadataRepository) {
        this.uploadDir = uploadDir;
        this.fileMetadataRepository = fileMetadataRepository;
    }

    public StoreFileDto storeFile(MultipartFile file, String directory) {

        validateFile(file);
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        String fileExtension = FilenameUtils.getExtension(fileName);
        String hashedFileName = generateHashedFileName(fileName) + "." + fileExtension;

        try {
            Path fileStorageLocation = Paths.get(uploadDir + "/" + directory).toAbsolutePath().normalize();
            Files.createDirectories(fileStorageLocation);

            Path targetLocation = fileStorageLocation.resolve(hashedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // 파일 메타데이터 저장
            FileMetadata metadata = new FileMetadata();
            metadata.setFileName(hashedFileName);
            metadata.setFileType(file.getContentType());
            metadata.setSize(file.getSize());
            metadata.setOriginalFileName(fileName);
            metadata.setFileDownloadUri(ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/downloadFile/")
                    .path(hashedFileName)
                    .toUriString());
            fileMetadataRepository.save(metadata);
            Long id = metadata.getId();
          //  System.out.println("file id: "+id);
            StoreFileDto dto = new StoreFileDto();
            dto.setId(id);
            dto.setFilename(hashedFileName);

            return dto;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    private String generateHashedFileName(String fileName) {
        // 파일 이름을 해싱하는 로직
        return DigestUtils.sha256Hex(fileName + System.currentTimeMillis());
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new FileStorageException("File is empty");
        }
        if (file.getOriginalFilename() == null) {
            throw new FileStorageException("File name is null");
        }
        if (file.getOriginalFilename().contains("..")) {
            throw new FileStorageException("File name contains invalid path sequence " + file.getOriginalFilename());
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileStorageException("File size exceeds the limit");
        }
        if (!isSupportedFileType(file.getContentType())) {
            throw new FileStorageException("File type is not supported");
        }
    }

    private boolean isSupportedFileType(String fileType) {
        // 지원하는 파일 타입인지 확인하는 로직
        return SUPPORTED_FILE_TYPES.contains(fileType);
    }

    // file 이름으로 파일을 찾아서 리소스로 반환
    public Resource loadFileAsResource(String fileName, String directory) {
        try {
            Path fileStorageLocation = Paths.get(uploadDir+ "/" + directory).toAbsolutePath().normalize();
            Path filePath = fileStorageLocation.resolve(StringUtils.cleanPath(fileName)).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if(resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new FileStorageException("Could not read file: " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new FileStorageException("Could not read file: " + fileName, ex);
        }
    }

    // 파일 로드 및 기타 필요한 메서드 구현

    public Optional<FileMetadata> findById(Long id) {
        return fileMetadataRepository.findById(id);
    }
}
