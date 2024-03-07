package com.ssafy.koala.repository;

import com.ssafy.koala.model.CustomobjModel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomobjRepository extends JpaRepository<CustomobjModel, Long> {

    // 해당 냉장고의 custom object 모두 찾아오기
    List<CustomobjModel> findByRefrigeratorId(Long refrigeratorId);

    // 기존에 등록한 커스텀 오브젝트 삭제
    @Transactional
    void deleteByRefrigeratorId(Long refrigeratorId);
}
