package com.ssafy.koala.service;

import com.ssafy.koala.model.CocktailModel;
import com.ssafy.koala.repository.CocktailRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CocktailService {
    private final CocktailRepository cocktailRepository;

    public CocktailService ( CocktailRepository cocktailRepository) {
        this.cocktailRepository = cocktailRepository;
    }

    public void saveAllCocktails(List<CocktailModel> cocktails) {
        cocktailRepository.saveAll(cocktails);
    }

    public void deleteCocktailsByBoardId(long boardId) {
        List<CocktailModel> cocktailsToDelete = cocktailRepository.findByBoardId(boardId);

        for (CocktailModel cocktail : cocktailsToDelete) {
            // 참조를 먼저 제거
            cocktail.setBoard(null);
        }

        // 삭제 연산 수행
        cocktailRepository.deleteInBatch(cocktailsToDelete);
    }
}
