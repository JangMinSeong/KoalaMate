package com.ssafy.koala.repository;

import com.ssafy.koala.model.BoardModel;
import com.ssafy.koala.model.CocktailModel;
import com.ssafy.koala.model.DrinkModel;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class BoardSpecifications {

    public static Specification<BoardModel> search(String keyword) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(keyword)) {
                predicates.add(criteriaBuilder.like(root.get("title"), "%" + keyword + "%"));
                //predicates.add(criteriaBuilder.like(root.get("nickname"), "%" + keyword + "%"));
                predicates.add(criteriaBuilder.like(root.get("content"), "%" + keyword + "%"));
            }

            return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<BoardModel> search(String keyword, String nickname, int option) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(keyword)) {
                Predicate keywordPredicate = criteriaBuilder.or(
                        criteriaBuilder.like(root.get("title"), "%" + keyword + "%"),
                        criteriaBuilder.like(root.get("content"), "%" + keyword + "%")
                );
                predicates.add(keywordPredicate);
            }

            if (StringUtils.hasText(nickname)) {
                Predicate nicknamePredicate;
                if (option == 1) {
                    nicknamePredicate = criteriaBuilder.equal(root.get("nickname"), "admin");
                } else {
                    nicknamePredicate = criteriaBuilder.notEqual(root.get("nickname"), "admin");
                }
                predicates.add(nicknamePredicate);
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }


    public static Specification<BoardModel> boardIsLikedByUser(List<Long> boardIds) {
        return (root, query, criteriaBuilder) -> {
            if (boardIds == null || boardIds.isEmpty()) {
                return criteriaBuilder.conjunction(); // 비어있는 조건 처리
            }
            return root.get("id").in(boardIds); // board_id 리스트에 포함된 BoardModel 조회
        };
    }

    public static Specification<BoardModel> withDrinkName(String drinkName) {
        return (root, query, criteriaBuilder) -> {
            if (drinkName == null || drinkName.isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            // cocktails과 drinks를 조인합니다.
            Join<BoardModel, CocktailModel> cocktailsJoin = root.join("cocktails", JoinType.INNER);
            Join<CocktailModel, DrinkModel> drinksJoin = cocktailsJoin.join("drink", JoinType.INNER);

            // drinks의 name을 기준으로 검색 조건을 설정합니다.
            return criteriaBuilder.like(drinksJoin.get("name"), "%" + drinkName + "%");
        };
    }


    // 프론트 요청

    public static Specification<BoardModel> searchOnlyTitle(String keyword) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (StringUtils.hasText(keyword)) {
                predicates.add(criteriaBuilder.like(root.get("title"), "%" + keyword + "%"));
                //predicates.add(criteriaBuilder.like(root.get("nickname"), "%" + keyword + "%"));
//                predicates.add(criteriaBuilder.like(root.get("content"), "%" + keyword + "%"));
            }

            return criteriaBuilder.or(predicates.toArray(new Predicate[0]));
        };
    }

    public static Specification<BoardModel> searchByNickname(String nickname, boolean isAdmin) {
        return (root, query, criteriaBuilder) -> {
            if (isAdmin) {
                return criteriaBuilder.equal(root.get("nickname"), "admin");
            } else {
                return criteriaBuilder.notEqual(root.get("nickname"), "admin");
            }
        };
    }

    // Overload for convenience
    public static Specification<BoardModel> searchByNickname(String nickname) {
        return searchByNickname(nickname, true); // Default to admin
    }


    public static Specification<BoardModel> withCategory(Integer category) {
        return (root, query, criteriaBuilder) -> {
            if (category == null) {
                return criteriaBuilder.conjunction(); // category가 null이면 모든 결과를 반환합니다.
            }

            // BoardModel과 CocktailModel, 그리고 DrinkModel을 조인합니다.
            Join<BoardModel, CocktailModel> cocktailsJoin = root.join("cocktails", JoinType.INNER);
            Join<CocktailModel, DrinkModel> drinksJoin = cocktailsJoin.join("drink", JoinType.INNER);

            // category를 기준으로 필터링 조건을 설정합니다.
            return criteriaBuilder.equal(drinksJoin.get("category"), category);
        };
    }
}