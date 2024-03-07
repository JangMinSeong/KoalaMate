package com.ssafy.koala.repository;

import com.ssafy.koala.model.DrinkModel;
import com.ssafy.koala.model.RefrigeratorDrinkModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RefrigeratorDrinkRepository extends JpaRepository<RefrigeratorDrinkModel, Long> {

    List<RefrigeratorDrinkModel> findByRefrigeratorId(Long refrigeratorId);
    void deleteByRefrigeratorId(Long refrigeratorId);
}
