package com.ssafy.koala.repository.file;

import com.ssafy.koala.model.file.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, Long> {
    FileMetadata findByFileName(String fileName);
}