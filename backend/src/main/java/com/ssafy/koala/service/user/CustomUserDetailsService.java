package com.ssafy.koala.service.user;

import com.ssafy.koala.dto.user.CustomUserDetails;
import com.ssafy.koala.dto.user.UserDto;
import com.ssafy.koala.model.user.UserModel;
import com.ssafy.koala.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// 인증 프로세스중에 사용자 세부 정보 제공
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
	private final UserRepository userRepository;

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		UserModel user = userRepository.findByEmail(email)
				.orElseThrow(() -> new UsernameNotFoundException("해당하는 유저가 없습니다."));

		UserDto dto = new UserDto();
		BeanUtils.copyProperties(user, dto);

		return new CustomUserDetails(dto);
	}
}
