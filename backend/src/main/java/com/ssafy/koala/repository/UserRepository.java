package com.ssafy.koala.repository;

import com.ssafy.koala.model.user.UserModel;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserModel,Long> {
	Optional<UserModel> getUserByEmail(String email);

	Optional<UserModel> findUserByNicknameOrEmail(String nickname, String email);

	Optional<UserModel> findUserByEmailAndPassword(String email, String password);

	Optional<UserModel> findUserByRefreshToken(String refreshToken);

	Optional<UserModel> findByEmail(String email);

    Optional<UserModel> findByNickname(String nickname);

	// 시치 추가
	@Transactional
	@Modifying
	@Query("UPDATE UserModel u SET u.refreshToken = :refreshToken WHERE u.email = :email")
	void updateRefreshTokenByEmail(@Param("refreshToken") String refreshToken, @Param("email") String email);
}
