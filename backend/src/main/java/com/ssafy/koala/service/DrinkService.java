package com.ssafy.koala.service;

import com.ssafy.koala.dto.board.BoardWithoutCocktailDto;
import com.ssafy.koala.dto.cocktail.CocktailWithBoardDto;
import com.ssafy.koala.dto.drink.DrinkDto;
import com.ssafy.koala.dto.drink.DrinkWithoutCocktailDto;
import com.ssafy.koala.model.DrinkModel;
import com.ssafy.koala.model.file.FileMetadata;
import com.ssafy.koala.repository.DrinkRepository;
import com.ssafy.koala.repository.LikeRepository;
import com.ssafy.koala.repository.file.FileMetadataRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DrinkService {
    private final DrinkRepository drinkRepository;
    private final FileMetadataRepository fileMetadataRepository;

    public DrinkService(DrinkRepository drinkRepository, FileMetadataRepository fileMetadataRepository) {
        this.drinkRepository = drinkRepository;
        this.fileMetadataRepository = fileMetadataRepository;
    }

    public DrinkDto getDrinkById(long id) {
        return convertToDto(drinkRepository.findById(id).orElse(null));
    }

    public DrinkModel getDrinkModelById(long id) {
        Optional<DrinkModel> drinkModel = drinkRepository.findById(id);
        if(drinkModel.isPresent()) {
            return drinkModel.get();
        }
        return null;
    }

    public DrinkModel createDrink(DrinkWithoutCocktailDto drinkDto) {
        DrinkModel drinkModel = new DrinkModel();
        BeanUtils.copyProperties(drinkDto, drinkModel);
        Optional<FileMetadata> fileMetadata = fileMetadataRepository.findById(drinkDto.getFileId());
        fileMetadata.ifPresent(drinkModel::setFileMetadata);

        return drinkRepository.save(drinkModel);
    }

    public List<DrinkDto> getDrinkByCategory(int category) {
        List<DrinkModel> drinks = drinkRepository.findAllByCategory(category);
        return drinks.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<DrinkDto> getDrinkByName(String name) {
        //System.out.println(name);
        List<DrinkModel> drinks = drinkRepository.findAllByNameContaining(name);
        //System.out.println(drinks.size());
        return drinks.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public DrinkDto convertToDto(DrinkModel drinkModel) {
        DrinkDto drinkDto = new DrinkDto();
        drinkDto.setId(drinkModel.getId());
        drinkDto.setName(drinkModel.getName());
        drinkDto.setCategory(drinkModel.getCategory());
        drinkDto.setLabel(drinkModel.getLabel());
        drinkDto.setImage(drinkModel.getImage());

        List<CocktailWithBoardDto> cocktails = drinkModel.getCocktails().stream()
                .map(temp -> {
                    CocktailWithBoardDto cocktailDto = new CocktailWithBoardDto();
                    cocktailDto.setId(temp.getId());
                    cocktailDto.setProportion(temp.getProportion());
                    cocktailDto.setUnit(temp.getUnit());

                    BoardWithoutCocktailDto insert = new BoardWithoutCocktailDto();
                    BeanUtils.copyProperties(temp.getBoard(),insert);
                    cocktailDto.setBoard(insert);

                    return cocktailDto;
                })
                .collect(Collectors.toList());

        drinkDto.setCocktails(cocktails);
        return drinkDto;
    }

}
