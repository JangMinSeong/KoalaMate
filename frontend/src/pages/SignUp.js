import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import Nav from 'components/Nav';
import {useForm, SubmitHandler} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    Avatar,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    RadioGroup,
    FormControlLabel,
    Radio,
    Button,
    Grid,
    Container, colors,
} from '@mui/material';
import GetMyPosition from "../components/GetMyPosition";
import { useLocation } from 'react-router-dom';

const SignUp = () => {
    const navigate = useNavigate();
    // 이메일 닉네임 중복검사
    const [isEmailAvailable, setIsEmailAvailable] = useState(true);
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(true);

    // 이메일 닉네임 중복검사 여부 확인
    const [isEmailChecked, setIsEmailChecked] = useState(false);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);

    // 위치 설정
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const location = useLocation();
    const emailFromHome = location.state?.email || '';

    // Yup 스키마 정의
    const schema = yup.object().shape({
        email: yup.string().email('올바른 이메일 주소를 입력하세요.').required('이메일을 입력하세요.'),
        password: yup.string().required('비밀번호를 입력하세요.').min(8, '비밀번호는 최소 8자 이상이어야 합니다.').matches(
            /^(?=.*[a-z-A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            '비밀번호에는 영문자, 숫자, 특수문자가 최소한 하나씩 포함되어야 합니다.',
        ),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], '비밀번호가 일치하지 않습니다.').required('비밀번호를 입력하세요.'),
        nickname: yup.string().required('닉네임을 입력하세요.').max(20, '닉네임은 최대 20자까지 입력 가능합니다.'),
        birthRange: yup.number().required('연령대를 선택하세요.'),
        gender: yup.string().required('성별을 선택하세요.'),
    });

    // React Hook Form 사용
    const {register, handleSubmit, getValues, formState: {errors}} = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            email: emailFromHome,
        },
    });

    const checkEmailAvailability = async (email) => {
   //     console.log("checkEmail: ", email);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/checkEmail`,
                {email})

            setIsEmailAvailable(response.data.available);
    //        console.log("이메일 중복 확인", response.data.available)
        } catch (error) {
            console.error('이메일 가용성 확인 중 오류 발생', error);
        }
    };

    const checkNicknameAvailability = async (nickname) => {
   //     console.log("checkNickname: ", nickname);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/checkNickname`,
                {nickname})
    //        console.log("닉네임 중복 확인", response.data.available)
            setIsNicknameAvailable(response.data.available);
        } catch (error) {
            console.error('닉네임 가용성 확인 중 오류 발생', error);
        }
    };

    const handleEmailCheck = (email) => {
    //    console.log(email);
        if (email) {
            checkEmailAvailability(email).then(r => console.log(r));
            setIsEmailChecked(true);
        }
    };

    const handleNicknameCheck = (nickname) => {
   //     console.log(nickname)
        if (nickname) {
            checkNicknameAvailability(nickname).then(r => console.log(r));
            setIsNicknameChecked(true);
        }
    };


    // 폼 제출 처리 함수
    const onSubmit = (data) => {
        const {email, password, nickname, birthRange, gender} = data;
  //      console.log('회원가입 데이터:', data);

// 중복 확인 여부를 검사하여 회원가입 처리
        if ((isEmailAvailable && isNicknameAvailable) && (isEmailChecked && isNicknameChecked)) {
            setIsEmailAvailable(false)
            setIsNicknameAvailable(false)
            setIsEmailChecked(false)
            setIsNicknameChecked(false)

            axios.post(`${process.env.REACT_APP_API_URL}/user/signup`,
                {email, password, nickname, birthRange, gender, latitude, longitude}).then(response => {
      //          console.log('회원가입 성공', response.data);
                navigate('/'); // 회원가입이 성공하면 '/'로 이동
            }).catch(error => {
                console.log('회원가입 실패 ', error);
                // 실패했을 때의 처리를 여기에 추가
            });
        } else {
            alert('이메일 또는 닉네임 중복 확인을 해주세요.');
        }
    };

    return (
        <>
            <Container component="main" maxWidth="sm">
                <Grid
                    container
                    spacing={2}
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Grid item>
                        <Avatar sx={{bgcolor: '#FF9B9B', mt: 3}}/>
                    </Grid>
                    <Grid item>
                        <Typography variant="h3">Sign Up</Typography>
                    </Grid>

                    <Grid item>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                label="이메일"
                                variant="outlined"
                                {...register('email')}
                                error={!!errors.email || !isEmailAvailable}
                                helperText={isEmailAvailable
                                    ? errors.email?.message
                                    : '이미 사용 중인 이메일입니다.'}
                                fullWidth
                                margin="normal"
                            />
                            {isEmailChecked && isEmailAvailable && (
                                <Typography
                                    variant="caption"
                                    sx={{color: 'green'}}
                                >
                                    사용 가능한 이메일입니다.
                                </Typography>
                            )}
                            <Grid container justifyContent="flex-end">
                                <Button variant="outlined" onClick={() => handleEmailCheck(getValues('email'))}>중복
                                    확인</Button>
                            </Grid>


                            <TextField
                                type="password"
                                label="비밀번호"
                                variant="outlined"
                                {...register('password')}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                type="password"
                                label="비밀번호 확인"
                                variant="outlined"
                                {...register('confirmPassword')}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                                fullWidth
                                margin="normal"
                            />

                            <TextField
                                label="닉네임"
                                variant="outlined"
                                {...register('nickname')}
                                error={!!errors.nickname || !isNicknameAvailable}
                                helperText={isNicknameAvailable
                                    ? errors.nickname?.message
                                    : '이미 사용 중인 닉네임입니다.'}
                                fullWidth
                                margin="normal"
                            />
                            {isNicknameChecked && isNicknameAvailable && (
                                <Typography
                                    variant="caption"
                                    sx={{color: 'green'}}
                                >
                                    사용 가능한 닉네임입니다.
                                </Typography>
                            )}
                            <Grid container justifyContent="flex-end">
                                <Button variant="outlined" onClick={() => handleNicknameCheck(getValues('nickname'))}>중복
                                    확인</Button>
                            </Grid>

                            <FormControl variant="outlined" fullWidth margin="normal">
                                <InputLabel>연령대</InputLabel>
                                <Select
                                    label="연령대를 선택하세요"
                                    {...register('birthRange')}
                                    error={!!errors.birthRange}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        연령대를 선택하세요
                                    </MenuItem>
                                    <MenuItem value="20">20대</MenuItem>
                                    <MenuItem value="30">30대</MenuItem>
                                    <MenuItem value="40">40대</MenuItem>
                                    <MenuItem value="50">50대</MenuItem>
                                </Select>
                                {errors.birthRange && (
                                    <Typography variant="caption" color="error">
                                        {errors.birthRange.message}
                                    </Typography>
                                )}
                            </FormControl>

                            <FormControl component="fieldset" error={!!errors.gender}
                                         fullWidth margin="normal">
                                <RadioGroup row aria-label="gender">
                                    <FormControlLabel value="남성"
                                                      control={<Radio {...register('gender', {value: '남성'})} />}
                                                      label="남성"/>
                                    <FormControlLabel value="여성"
                                                      control={<Radio {...register('gender', {value: '여성'})} />}
                                                      label="여성"/>
                                </RadioGroup>
                                {errors.gender && (
                                    <Typography variant="caption" color="error">
                                        {errors.gender.message}
                                    </Typography>
                                )}
                            </FormControl>

                            <GetMyPosition setLatitude={setLatitude} setLongitude={setLongitude} />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{mt: 3, mb: 2}}
                                size="large"
                                // disabled={!isSubmitEnabled} // 중복확인이 완료되지 않으면 버튼 비활성화
                            >
                                회원가입
                            </Button>
                        </form>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default SignUp;
