package com.ssafy.koala.repository;

import com.ssafy.koala.model.CocktailModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CocktailRepository extends JpaRepository<CocktailModel,Long> {
    public List<CocktailModel> findByDrinkId(long id);
    public List<CocktailModel> findByBoardId(long id);

   // public void deleteByBoardId(long id);

}
