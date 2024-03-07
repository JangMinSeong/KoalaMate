package com.ssafy.koala.repository;

import com.ssafy.koala.model.RefrigeratorModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefrigeratorRepository extends JpaRepository<RefrigeratorModel, Long> {

        Optional<RefrigeratorModel> findByUserId(Long userId);

}
