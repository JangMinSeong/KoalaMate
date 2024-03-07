package com.ssafy.koala.repository;

import com.ssafy.koala.model.DrinkModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DrinkRepository extends JpaRepository<DrinkModel, Long> {

    List<DrinkModel> findAllByCategory(int category);

    List<DrinkModel> findAllByNameContaining(String name);

    @Query("select d from DrinkModel d where d.id IN "
            + "(select rdm.drink.id from RefrigeratorDrinkModel rdm "
            + "where rdm.refrigerator.id = (select r.id from RefrigeratorModel r where r.user.id = :user_id))")
    List<DrinkModel> findAllEntitiesByUserId(@Param("user_id") Long user_id);

    List<DrinkModel> findByIdIn(List<Long> ids);
}
