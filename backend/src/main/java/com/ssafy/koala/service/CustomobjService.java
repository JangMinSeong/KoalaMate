package com.ssafy.koala.service;

import com.ssafy.koala.dto.CustomobjDto;
import com.ssafy.koala.model.CustomobjModel;
import com.ssafy.koala.repository.CustomobjRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

@Service
public class CustomobjService {

    private final CustomobjRepository customobjRepository;

    public CustomobjService(CustomobjRepository customobjRepository) {
        this.customobjRepository = customobjRepository;
    }

    public CustomobjDto getCustomobjById(Long id) {
        CustomobjModel customobj = customobjRepository.findById(id).orElse(null);
        if (customobj != null) {
            CustomobjDto customobjDto = new CustomobjDto();
            BeanUtils.copyProperties(customobj, customobjDto);
            return customobjDto;
        }
        return null;
    }

    public CustomobjDto addCustomobj(CustomobjDto customobjDto) {
        CustomobjModel customobj = new CustomobjModel();
        BeanUtils.copyProperties(customobjDto, customobj);
        CustomobjModel savedCustomobj = customobjRepository.save(customobj);
        CustomobjDto savedCustomobjDto = new CustomobjDto();
        BeanUtils.copyProperties(savedCustomobj, savedCustomobjDto);
        return savedCustomobjDto;
    }
}