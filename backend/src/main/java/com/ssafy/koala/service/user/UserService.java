package com.ssafy.koala.service.user;

import com.ssafy.koala.config.jwt.JwtUtil;
import com.ssafy.koala.dto.drink.DrinkWithoutCocktailDto;
import com.ssafy.koala.dto.user.TokenResponse;
import com.ssafy.koala.dto.user.UserDto;
import com.ssafy.koala.dto.user.UserResponseDto;
import com.ssafy.koala.model.DrinkModel;
import com.ssafy.koala.model.LikeModel;
import com.ssafy.koala.model.RefrigeratorModel;
import com.ssafy.koala.model.user.FollowModel;
import com.ssafy.koala.model.user.UserModel;
import com.ssafy.koala.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder encoder;

    private final RefrigeratorRepository refrigeratorRepository;
    private final FollowRepository followRepository;
    private final DrinkRepository drinkRepository;
    private final LikeRepository likeRepository;


    public Optional<UserDto> findUserByEmailAndPassword(String email, String password) {
        UserModel user = userRepository.findUserByEmailAndPassword(email, password).orElse(null);

        return (user != null) ? Optional.of(convertToDto(user)) : Optional.empty();
    }

    public Optional<UserDto> findUserByNicknameOrEmail(String nickname, String email) {
        UserModel user = userRepository.findUserByNicknameOrEmail(nickname, email).orElse(null);

        return (user != null) ? Optional.of(convertToDto(user)) : Optional.empty();
    }

    public Optional<UserDto> findUserByRefreshToken(String refreshToken) {
        UserModel user = userRepository.findUserByRefreshToken(refreshToken).orElse(null);

        return (user != null) ? Optional.of(convertToDto(user)) : Optional.empty();
    }

    public Optional<UserDto> findByEmail(String email) {
        UserModel user = userRepository.findByEmail(email).orElse(null);

        return (user != null) ? Optional.of(convertToDto(user)) : Optional.empty();
    }

    public Optional<UserDto> findByNickname(String nickname) {
        UserModel user = userRepository.findByNickname(nickname).orElse(null);

        return (user != null) ? Optional.of(convertToDto(user)) : Optional.empty();
    }

    @Transactional
    public Map<String, Object> auth(UserDto dto) {
        String email = dto.getEmail();
        String password = dto.getPassword();
        Optional<UserModel> userOpt = userRepository.findByEmail(email);

        if (userOpt.isPresent()) { // 유저 정보가 db에 존재
            // 암호화된 password를 디코딩한 값과 입력한 패스워드 값이 다르면 null 반환
            if (!encoder.matches(password, userOpt.get().getPassword())) {
                throw new BadCredentialsException("비밀번호가 일치하지 않습니다.");
            }
            UserDto result = new UserDto();
            BeanUtils.copyProperties(userOpt.get(), result);
            String accessToken = jwtUtil.createAccessToken(result);
            String refreshToken = jwtUtil.createRefreshToken(result);

//			result.setRefreshToken(refreshToken);
//			userRepository.save(convertToModel(result)); // refreshToken은 db에 저장(redis 변경?)

            userRepository.updateRefreshTokenByEmail(refreshToken, email); // 수정된 부분

            TokenResponse tokenResponse = new TokenResponse();
            tokenResponse.setAccessToken(accessToken);
            tokenResponse.setRefreshToken(refreshToken);

            Map<String, Object> resultMap = new HashMap<>();
            resultMap.put("user", result); // 사용자 정보 반환해용
            resultMap.put("tokens", tokenResponse); // 토큰 정보 반환해용
            return resultMap;
        } else {
            throw new UsernameNotFoundException("이메일이 존재하지 않습니다.");
        }
    }

    public void save(UserDto newUser) {
        if (newUser.getPassword() != null) {
            newUser.setPassword(encoder.encode(newUser.getPassword())); // 비밀번호 암호화
        }
        UserModel user = convertToModel(newUser);
        userRepository.save(user);
    }

    private UserDto convertToDto(UserModel user) {
        UserDto userDto = new UserDto();
        BeanUtils.copyProperties(user, userDto);
        return userDto;
    }

    private UserModel convertToModel(UserDto user) {
        UserModel userModel = new UserModel();
        BeanUtils.copyProperties(user, userModel);
        return userModel;
    }


    @Transactional
    public TokenResponse createUserWithRefrigerator(UserDto newUserDto) {
        newUserDto.setPassword(encoder.encode(newUserDto.getPassword())); // 비밀번호 암호화
        UserModel newUser = convertToModel(newUserDto);

        // 냉장고 정보 저장
        RefrigeratorModel newRefrigerator = new RefrigeratorModel();
        newRefrigerator = refrigeratorRepository.save(newRefrigerator);
      //  System.out.println(newRefrigerator.getId());

        // 냉장고에 유저 설정
        newRefrigerator.setUser(newUser);

        // 유저에 냉장고 설정
        newUser.setRefrigerator(newRefrigerator);

        // 유저 정보 저장 (이때 냉장고 정보도 함께 저장됨)
        newUser = userRepository.save(newUser);
     //   System.out.println(newUser.getRefrigerator().getId());

        // 토큰 생성
        String accessToken = jwtUtil.createAccessToken(convertToDto(newUser));
        String refreshToken = jwtUtil.createRefreshToken(convertToDto(newUser));

        // refreshToken은 redis 저장 필요
        TokenResponse tokenResponse = new TokenResponse();
        tokenResponse.setAccessToken(accessToken);
        tokenResponse.setRefreshToken(refreshToken);

        return tokenResponse;
    }

    public Optional<UserModel> findById(long userId) {
        return userRepository.findById(userId);

    }

    @Transactional
    public void saveLocation(Long userId, double latitude, double longitude) {
        Optional<UserModel> existingUser = userRepository.findById(userId);


        if (existingUser.isPresent()) {
            UserModel user = existingUser.get();
            user.setLatitude(latitude);
            user.setLongitude(longitude);
            userRepository.save(user);
        }
    }

    @Transactional
    public List<UserResponseDto> findAllUser(Long id) {
        List<UserResponseDto> result = new ArrayList<>();
        List<FollowModel> follows = followRepository.findFolloweeByFollower_Id(id);

        List<UserModel> users = userRepository.findAll();
        for(UserModel user : users) {
            UserResponseDto tmp = new UserResponseDto();
            BeanUtils.copyProperties(user, tmp);

            for(FollowModel follow : follows) {
                if(user.getId() == follow.getFollowee().getId()) {
                    tmp.setFollow(true);
                    break;
                }
            }

            int likeCnt = likeRepository.existsCommonBoardIdForUsers(id, user.getId());
            tmp.setLikeCnt(likeCnt);

            List<DrinkModel> drinks = drinkRepository.findAllEntitiesByUserId(user.getId());
            List<DrinkWithoutCocktailDto> drinkList = new ArrayList<>();

            for(DrinkModel d : drinks) {
                DrinkWithoutCocktailDto drink = new DrinkWithoutCocktailDto();
                BeanUtils.copyProperties(d, drink);
                drinkList.add(drink);
            }

            tmp.setDrinks(drinkList);
            result.add(tmp);
        }
        return result;
    }

    @Transactional
    public void updateMannerScore(String email, double score) {
        Optional<UserModel> user = userRepository.findByEmail(email);
        if(user.isPresent()) {
            double storedScore = user.get().getMannersScore(); // 기존 평점
            int storedCnt = user.get().getEvaluateCnt(); // 기존 평가한 사람 수
            double originalScore = storedScore * (storedCnt);
            originalScore += score;
            user.get().setMannersScore(originalScore / ++storedCnt);
            user.get().setEvaluateCnt(storedCnt);
            userRepository.save(user.get());
        }
    }
}
