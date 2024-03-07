package com.ssafy.koala.service;

import com.ssafy.koala.dto.CustomobjDto;
import com.ssafy.koala.dto.RefrigeratorDTO;
import com.ssafy.koala.dto.RefrigeratorDrinkDTO;
import com.ssafy.koala.dto.drink.DrinkWithoutCocktailDto;
import com.ssafy.koala.dto.RefrigeratorInsideDto;
import com.ssafy.koala.model.CustomobjModel;
import com.ssafy.koala.model.DrinkModel;
import com.ssafy.koala.model.RefrigeratorDrinkModel;
import com.ssafy.koala.model.RefrigeratorModel;
import com.ssafy.koala.repository.CustomobjRepository;
import com.ssafy.koala.repository.DrinkRepository;
import com.ssafy.koala.repository.RefrigeratorDrinkRepository;
import com.ssafy.koala.repository.RefrigeratorRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class RefrigeratorService {

    private final RefrigeratorRepository refrigeratorRepository;
    private final CustomobjRepository customobjRepository;
//    private final RefrigeratorCustomobjRepository refrigeratorCustomobjRepository;
    private final DrinkRepository drinkRepository;
    private final RefrigeratorDrinkRepository refrigeratorDrinkRepository;

    @Autowired
    public RefrigeratorService(RefrigeratorRepository refrigeratorRepository,
                               CustomobjRepository customobjRepository,
//                               RefrigeratorCustomobjRepository refrigeratorCustomobjRepository,
                               DrinkRepository drinkRepository,
                               RefrigeratorDrinkRepository refrigeratorDrinkRepository) {
        this.refrigeratorRepository = refrigeratorRepository;
        this.customobjRepository = customobjRepository;
//        this.refrigeratorCustomobjRepository = refrigeratorCustomobjRepository;
        this.drinkRepository = drinkRepository;  // 추가
        this.refrigeratorDrinkRepository = refrigeratorDrinkRepository;
    }


    public RefrigeratorModel saveRefrigerator(RefrigeratorModel refrigerator) {
        return refrigeratorRepository.save(refrigerator);
    }

    public Optional<RefrigeratorDTO> getRefrigeratorByUserId(Long userId) {
        return refrigeratorRepository.findByUserId(userId)
                .map(RefrigeratorDTO::fromEntity);
    }

    public RefrigeratorDTO modifyRefrigeratorByUserId(Long userId, RefrigeratorDTO updatedRefrigeratorDTO) {
        Optional<RefrigeratorModel> refrigeratorOptional = refrigeratorRepository.findByUserId(userId);
        if (refrigeratorOptional.isPresent()) {
            RefrigeratorModel refrigerator = refrigeratorOptional.get();

            // 냉장고 정보 업데이트
            refrigerator.setRefrigeratorType(updatedRefrigeratorDTO.getRefrigeratorType());
            refrigerator.setColor(updatedRefrigeratorDTO.getColor());

            refrigeratorRepository.save(refrigerator); // 업데이트된 엔터티 저장

            return RefrigeratorDTO.fromEntity(refrigerator);
        }
        return null; // 해당 유저의 냉장고가 존재하지 않을 경우
    }

//    public List<CustomobjDto> getRefrigeratorContentsByUserId(Long userId) {
//        Optional<RefrigeratorModel> refrigeratorOptional = refrigeratorRepository.findByUserId(userId);
//        if (refrigeratorOptional.isPresent()) {
//            RefrigeratorModel refrigerator = refrigeratorOptional.get();
//            List<RefrigeratorCustomobjModel> customobjs = refrigerator.getRefrigeratorCustomobjs(); // 수정: 속성명 변경
//
//            // Customobj를 DTO로 변환하여 리턴하는 부분을 구현
//            List<RefrigeratorCustomobjDTO> customobjDTOs = customobjs.stream()
//                    .map(RefrigeratorCustomobjDTO::fromEntity)
//                    .collect(Collectors.toList());
//            return customobjDTOs;
//        }
//        return Collections.emptyList(); // 해당 유저의 냉장고가 존재하지 않을 경우
//    }

//    public List<RefrigeratorCustomobjDTO> modifyRefrigeratorContentsByUserId(Long userId, List<RefrigeratorCustomobjDTO> updatedContentsDTO) {
//        Optional<RefrigeratorModel> refrigeratorOptional = refrigeratorRepository.findByUserId(userId);
//        if (refrigeratorOptional.isPresent()) {
//            RefrigeratorModel refrigerator = refrigeratorOptional.get();
//            List<RefrigeratorCustomobjModel> customobjs = refrigerator.getRefrigeratorCustomobjs(); // 수정: 속성명 변경
//
//            // updatedContentsDTO에 따라 customobjs를 업데이트
//
//            refrigeratorRepository.save(refrigerator); // 업데이트된 엔터티 저장
//
//            // Customobj를 DTO로 변환하여 리턴하는 부분을 구현
//            List<RefrigeratorCustomobjDTO> customobjDTOs = customobjs.stream()
//                    .map(RefrigeratorCustomobjDTO::fromEntity)
//                    .collect(Collectors.toList());
//            return customobjDTOs;
//        }
//        return Collections.emptyList(); // 해당 유저의 냉장고가 존재하지 않을 경우
//    }


    public List<RefrigeratorDrinkDTO> addDrinksToRefrigerator(Long userId, List<Long> drinkIds) {
        Optional<RefrigeratorModel> refrigeratorOptional = refrigeratorRepository.findByUserId(userId);

        if (refrigeratorOptional.isPresent()) {
            RefrigeratorModel refrigerator = refrigeratorOptional.get();

            // 기존 음료 다 날리고 업데이트 할거에요~ 날리는 단계입니다~
            refrigeratorDrinkRepository.deleteByRefrigeratorId(refrigerator.getId());

            List<RefrigeratorDrinkModel> refrigeratorDrinkModels = new ArrayList<>();

            for (Long drinkId : drinkIds) {
                Optional<DrinkModel> drinkOptional = drinkRepository.findById(drinkId);
                if (drinkOptional.isPresent()) {
                    DrinkModel drink = drinkOptional.get();

                    RefrigeratorDrinkModel refrigeratorDrinkModel = new RefrigeratorDrinkModel();
                    refrigeratorDrinkModel.setRefrigerator(refrigerator);
                    refrigeratorDrinkModel.setDrink(drink);

                    // 음료 추가 시 posIdx 재설정 필요 없으므로, 0 또는 1부터 시작하도록 설정
                    // 이전 음료가 삭제되었으므로, 여기서는 간단하게 리스트의 크기를 사용
                    int posIdx = refrigeratorDrinkModels.size() + 1;
                    // setPosIdx를 여기서 하면 여러 개 올릴 때 idx가 같은값으로 여러개가 올라감
                    // 그냥 사용자가 냉장고 + 버튼 눌러서 지정하도록 합시다~
                    refrigeratorDrinkModel.setPosIdx(posIdx);

                    refrigeratorDrinkModels.add(refrigeratorDrinkModel);
                }
            }

            refrigeratorDrinkRepository.saveAll(refrigeratorDrinkModels);

            // Drink를 DTO로 변환하여 리턴
            List<RefrigeratorDrinkDTO> modifiedContents = refrigeratorDrinkModels.stream()
                    .map(RefrigeratorDrinkDTO::fromEntity)
                    .collect(Collectors.toList());

            return modifiedContents;
        }

        return Collections.emptyList(); // 해당 유저의 냉장고나 Drink가 존재하지 않을 경우
    }


    // 냉장고에 커스텀 오브젝트 추가
    public boolean addCustomobjsToRefrigerator(Long userId, List<CustomobjDto> customobjDTOs) {
        Optional<RefrigeratorModel> refrigeratorOptional = refrigeratorRepository.findByUserId(userId);

        if (refrigeratorOptional.isPresent()) {
            RefrigeratorModel refrigerator = refrigeratorOptional.get();

            // 기존에 추가된 오브젝트가 있다면 모두 삭제 후 새로운 오브젝트 추가
            customobjRepository.deleteByRefrigeratorId(refrigerator.getId());

            // 여러 개의 DTO를 처리하기 위한 반복문
            List<CustomobjModel> newCustomobjs = new ArrayList<>();
            for (CustomobjDto customobjDTO : customobjDTOs) {
                CustomobjModel customobjModel = new CustomobjModel();
                BeanUtils.copyProperties(customobjDTO, customobjModel);
                customobjModel.setRefrigerator(refrigerator);
                newCustomobjs.add(customobjModel);
            }
            customobjRepository.saveAll(newCustomobjs);
            return true;
        }
        // 해당 유저의 냉장고가 존재하지 않을 경우
        return false;
    }

    // 냉장고 자석 오브젝트 반환
    public List<CustomobjDto> getObjectsByRefrigeratorId(Long refrigeratorId) {
        List<CustomobjDto> result = new ArrayList<>();
        List<CustomobjModel> queryResult = customobjRepository.findByRefrigeratorId(refrigeratorId);
        for(CustomobjModel cm : queryResult) {
            CustomobjDto dto = new CustomobjDto();
            BeanUtils.copyProperties(cm, dto);
            result.add(dto);
        }
        return result;
    }

    public List<RefrigeratorInsideDto> getDrinksByUserId(Long userId) {
        Optional<RefrigeratorModel> refrigeratorOptional = refrigeratorRepository.findByUserId(userId);
        return refrigeratorOptional.map(refrigerator -> {
            // DrinkModel 객체들을 조회
            List<Long> drinkIds = refrigerator.getRefrigeratorDrinkModels().stream()
                    .map(refrigeratorDrinkModel -> refrigeratorDrinkModel.getDrink().getId())
                    .collect(Collectors.toList());
            List<DrinkModel> drinks = drinkRepository.findByIdIn(drinkIds);

            // drinks 리스트를 ID를 키로 하는 맵으로 변환하여 검색 시간 단축
            Map<Long, DrinkModel> drinksMap = drinks.stream()
                    .collect(Collectors.toMap(DrinkModel::getId, Function.identity()));

            // 결과 리스트 생성 및 반환
            return refrigerator.getRefrigeratorDrinkModels().stream().map(rdmodel -> {
                DrinkWithoutCocktailDto drinkDto = new DrinkWithoutCocktailDto();
                // ID 비교를 통해 해당 DrinkModel 찾기
                DrinkModel drinkModel = drinksMap.get(rdmodel.getDrink().getId());
                if (drinkModel != null) {
                    BeanUtils.copyProperties(drinkModel, drinkDto);
                }

                RefrigeratorInsideDto insert = new RefrigeratorInsideDto();
                insert.setDrink(drinkDto);
                insert.setPosIdx(rdmodel.getPosIdx());
                insert.setId(rdmodel.getId());
                insert.setRefrigeratorId(rdmodel.getRefrigerator().getId());

                return insert;
            }).collect(Collectors.toList());
        }).orElse(Collections.emptyList()); // 냉장고가 없을 경우 빈 리스트 반환

    }
}
