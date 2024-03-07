package com.ssafy.koala.repository;

import com.ssafy.koala.model.BoardModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<BoardModel, Long>, JpaSpecificationExecutor<BoardModel> {
    Page<BoardModel> findAll(Specification<BoardModel> spec, Pageable pageable);

    @Query("select b from BoardModel b where b.nickname = :nickname")
    Page<BoardModel> findByNickname(@Param("nickname") String nickname, Pageable pageable);

    @Query("select b from BoardModel b where b.nickname <> 'admin'")
    Page<BoardModel> findUserBoard(Pageable pageable);

    @Query("select b from BoardModel b where b.id in (select c.board.id from CocktailModel c where c.drink.name like '%' || :name || '%')")
    Page<BoardModel> findBoardByDrinkName(@Param("name") String name, Pageable pageable);

    @Query("select b from BoardModel b where b.id in (select c.board.id from CocktailModel c where c.drink.category = :category)")
    Page<BoardModel> findBoardByDrinkCategory(@Param("category") int category, Pageable pageable);

    @Query("select b from BoardModel b where b.userId = :userId")
    Page<BoardModel> findBoardById(@Param("userId") Long userId, Pageable pageable);





    //////////////////////춘춘따리춘춘따/////////////////////////



    // category가 null일 때 모든 카테고리를 대상으로 검색해야하는데..



    @Query("SELECT b FROM BoardModel b JOIN b.cocktails c WHERE b.nickname = :nickname AND (:category IS NULL OR c.drink.category = :category) AND SIZE(b.cocktails) BETWEEN :minDrinks AND :maxDrinks")
    Page<BoardModel> findByAdminAndCategoryWithDrinkCountInRange(@Param("nickname") String nickname, @Param("minDrinks") int minDrinks, @Param("maxDrinks") int maxDrinks, @Param("category") Integer category, Pageable pageable);

    @Query("SELECT b FROM BoardModel b JOIN b.cocktails c WHERE b.nickname <> :nickname AND (:category IS NULL OR c.drink.category = :category) AND SIZE(b.cocktails) BETWEEN :minDrinks AND :maxDrinks")
    Page<BoardModel> findByNonAdminAndCategoryWithDrinkCountInRange(@Param("nickname") String nickname, @Param("minDrinks") int minDrinks, @Param("maxDrinks") int maxDrinks, @Param("category") Integer category, Pageable pageable);

    @Query("SELECT b FROM BoardModel b JOIN b.cocktails c WHERE (:category IS NULL OR c.drink.category = :category) AND SIZE(b.cocktails) BETWEEN :minDrinks AND :maxDrinks")
    Page<BoardModel> findByCategoryWithDrinkCountInRange(@Param("minDrinks") int minDrinks, @Param("maxDrinks") int maxDrinks, @Param("category") Integer category, Pageable pageable);

    @Query("SELECT b FROM BoardModel b WHERE b.nickname = :nickname AND SIZE(b.cocktails) BETWEEN :minDrinks AND :maxDrinks")
    Page<BoardModel> findByAdminWithDrinkCountInRange(@Param("nickname") String nickname, @Param("minDrinks") int minDrinks, @Param("maxDrinks") int maxDrinks, Pageable pageable);

    @Query("SELECT b FROM BoardModel b WHERE b.nickname <> :nickname AND SIZE(b.cocktails) BETWEEN :minDrinks AND :maxDrinks")
    Page<BoardModel> findByNonAdminWithDrinkCountInRange(@Param("nickname") String nickname, @Param("minDrinks") int minDrinks, @Param("maxDrinks") int maxDrinks, Pageable pageable);

    @Query("SELECT b FROM BoardModel b WHERE SIZE(b.cocktails) BETWEEN :minDrinks AND :maxDrinks")
    Page<BoardModel> findByDrinkCountInRange(@Param("minDrinks") int minDrinks, @Param("maxDrinks") int maxDrinks, Pageable pageable);

}
