import React, {useState, useEffect, useRef} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import MyPageButton from '../components/Profile/MyPageButton';
import NoImage from 'assets/profile.jpg';
import {
    Typography,
    Box,
    Container,
    Chip,
    Button, Grid,
} from '@mui/material';
import TagsInput from "../components/Profile/Update/TagsInput";
import ProfileImageUploader from "../components/Profile/Update/ProfileImageUploader";
import DrinkingAmountInput from "../components/Profile/Update/DrinkingAmountInput";
import IntroductionInput from "../components/Profile/Update/IntroductionInput";
import GenderBirthRange from "../components/GenderBirthRange";
import GetMyPosition from "../components/GetMyPosition";

const UpdateMyPage = () => {

    // 위치 설정
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);


    // 인증 헤더를 가져오는 함수
    const getAuthHeader = () => {
        const authHeader = localStorage.getItem('authHeader');
        return authHeader ? {Authorization: authHeader} : {};
    };

    const [myId, setMyId] = useState(null); // 사용자 ID를 저장할 상태
    const getMyId = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/user/myId`,
                {}, {
                    headers: getAuthHeader(), // 인증 헤더 추가
                });
            // API 응답 구조에 맞게 수정할 것
            setMyId(response.data); // 가정: 응답이 { userId: '...' } 구조를 가짐
        } catch (error) {
            console.error('내 아이디 가지고 오는 중 에러 발생: ', error);
        }
    };

    // 컴포넌트 마운트 시 사용자 ID 가져오기
    useEffect(() => {
        getMyId();
    }, []);

    // const imageInputRef = useRef(null);


    // state
    const [profileData, setProfileData] = useState({
        nickname: '',
        birthRange: 0,
        gender: '',
        profile: '',
        introduction: '',
        alcoholLimitBottle: 0,
        alcoholLimitGlass: 0,
        tags: [],
    });
    const [imagePreview, setImagePreview] = useState(NoImage);
    const [sojuBottleCount, setSojuBottleCount] = useState(0);
    const [sojuCupCount, setSojuCupCount] = useState(0);
    const [introduction, setIntroduction] = useState('');
    const [tagOptions, setTagOptions] = useState([
        "1~2명", "3~5명", "6~8명", "8~10명",
        "20대", "30대", "40대", "50대", "60대 이상",
        "직장인", "학생", "취준생", "주부", "홈 프로텍터",
        "남자만", "여자만", "남녀 모두",
    ]);

    const [selectedTags, setSelectedTags] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [addTag, setAddTag] = useState('');
    const [error, setError] = useState('');

    // selectedImageFile 상태를 관리하기 위한 useState
    const [selectedImageFile, setSelectedImageFile] = useState(null);

    const navigate = useNavigate()

    const [fileInfo, setFileInfo] = useState({id: null, fileDownloadUri: ''});

    // 기존 이미지 URL과 이미지 삭제 여부를 추적하는 상태 추가
    const [originalProfileUrl, setOriginalProfileUrl] = useState('');
    const [isImageDeleted, setIsImageDeleted] = useState(false);


    // user 프로필 정보를 가져오는 함수
    useEffect(() => {
        const getProfileData = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/profile/${myId}`);
                const data = response.data;

                setProfileData({
                    nickname: data.nickname || '',
                    birthRange: data.birthRange || 0,
                    gender: data.gender || '',
                    profile: data.profile || NoImage,
                    introduction: data.introduction || '',
                    alcoholLimitBottle: data.alcoholLimitBottle || 0,
                    alcoholLimitGlass: data.alcoholLimitGlass || 0,
                    tags: data.tags || [],
                });

                // 기존 태그 옵션에 사용자가 추가한 태그들을 병합
                const updatedTagOptions = [...new Set([...tagOptions, ...data.tags.filter(tag => !tagOptions.includes(tag))])];
                setTagOptions(updatedTagOptions);

                // setProfileData 이후에 상태 업데이트 수행
                setSojuBottleCount(data.alcoholLimitBottle || 0);
                setSojuCupCount(data.alcoholLimitGlass || 0);
                setIntroduction(data.introduction || '');
                setSelectedTags(data.tags || []);
                setImagePreview(data.profile || NoImage);

                setOriginalProfileUrl(data.profile || NoImage); // 기존 프로필 이미지 URL 저장
                setIsImageDeleted(false); // 이미지 삭제 여부 초기화
            } catch (error) {
                console.log('프로필 데이터를 가져오는 중 에러 발생: ', error);
            }
        };

        getProfileData();
    }, [myId]);


    // 프로필 이미지 변경 함수
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // 이미지 파일인지 확인
            if (!file.type.startsWith('image/')) {
                alert('이미지 파일만 업로드할 수 있습니다.');
                return;
            }

            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };

            // 이미지 파일을 상태로 업데이트
            setSelectedImageFile(file);
        }
    };


    // 프로필 기본 이미지로 초기화하는 함수
    const handleCancelImage = () => {
        setImagePreview(NoImage);
        setOriginalProfileUrl(null);
        setIsImageDeleted(true); // 이미지 삭제 여부를 true로 설정
    };

    // 태그 선택 함수
    // const handleTagClick = (clickTag) => {
    //     if (selectedTags.includes(clickTag)) {
    //         setSelectedTags((prevTags) => prevTags.filter((tag) => tag !== clickTag));
    //     } else {
    //         setSelectedTags((prevTags) => [...prevTags, clickTag]);
    //     }
    // };

    const handleTagClick = (tag) => {
        setSelectedTags(prevTags => {
            const index = prevTags.indexOf(tag);
            if (index > -1) {
                // 태그가 이미 선택된 경우, 제거
                return prevTags.filter(t => t !== tag);
            } else {
                // 태그가 선택되지 않은 경우, 추가
                return [...prevTags, tag];
            }
        });
    };

    // 태그 추가 버튼 클릭 함수 (클릭할 때마다 폼 표시 여부 토글)
    const handleAddButton = () => {
        setIsVisible(!isVisible);
    };

    const addTagOptions = () => {
        if (addTag.trim() !== '' && addTag.length <= 10) {
            if (!tagOptions.includes(addTag)) {
                const updatedTags = [...tagOptions, addTag];

                // 선택된 태그 업데이트
                setSelectedTags([...selectedTags, addTag]);

                // 상태 업데이트
                setTagOptions(updatedTags);
                setAddTag('');
                setError('');
            } else {
                setError('이미 존재하는 태그입니다.');
            }
        } else {
            setError('태그는 1자 이상 10자 이하로 작성해주세요.');
        }
    };

    // 태그 삭제 핸들러
    const handleRemoveTag = (tagToRemove) => {
        setTagOptions(prevOptions => prevOptions.filter(tag => tag !== tagToRemove));
        setSelectedTags(prevSelected => prevSelected.filter(tag => tag !== tagToRemove));
    };

    const SaveProfileImage = async () => {
        try {
     //       console.log("Selected Image File:", selectedImageFile);
            // 이미지 파일이 선택되지 않았을 경우 예외처리
            if (!selectedImageFile) {
                // console.error("이미지 파일이 선택되지 않았습니다.");
                return;
            }
            // FormData 객체를 생성하여 이미지 파일을 담음
            const formData = new FormData();
            formData.append("file", selectedImageFile);
            formData.append("type", "profile");


            // Axios를 사용하여 이미지를 업로드하는 요청 보냄
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/profile/upload`, formData, {
                headers: getAuthHeader(), // 인증 헤더 추가
            });

            // 응답에 따른 처리 (여기서는 콘솔에 출력)
     //       console.log(response.data);

            return response.data;
        } catch (error) {
            console.error("프로필 이미지 업로드에 실패했습니다.", error);
        }
    };

    // saveProfile 함수 수정
    // const saveProfile = async (FileResult) => {
    //     try {
    //         // 서버에 요청 보내기
    //         const response = await axios.put(
    //             `${process.env.REACT_APP_API_URL}/profile/modify`,
    //             {
    //                 nickname: profileData.nickname,
    //                 birthRange: profileData.birthRange,
    //                 gender: profileData.gender,
    //                 introduction: introduction,
    //                 alcoholLimitBottle: sojuBottleCount,
    //                 alcoholLimitGlass: sojuCupCount,
    //                 tags: selectedTags,
    //                 latitude: latitude,
    //                 longitude: longitude,
    //                 // FileResult가 있을 경우에만 파일정보(파일id, 프로필 URL) 업데이트
    //                 ...(FileResult && {
    //                     fileId: FileResult.id,
    //                     profile: FileResult.fileDownloadUri,
    //                 }),
    //             }, {
    //                 headers: getAuthHeader() // 인증 헤더 추가
    //             });
    //  //       console.log('프로필 저장 성공:', response.data);
    //
    //         // 프로필 저장 완료 확인 창
    //         alert('프로필이 성공적으로 변경되었습니다😊')
    //         // 프로필 저장이 완료되면 사용자를 해당 페이지로 이동
    //         navigate(`/user/${myId}`);
    //
    //     } catch (error) {
    //         console.log('프로필 저장 중 에러 발생:', error);
    //     }
    // };

    // saveProfile 함수 수정
    const saveProfile = async (FileResult) => {
        let requestData = {
            nickname: profileData.nickname,
            birthRange: profileData.birthRange,
            gender: profileData.gender,
            introduction: introduction,
            alcoholLimitBottle: sojuBottleCount,
            alcoholLimitGlass: sojuCupCount,
            tags: selectedTags,
            latitude: latitude,
            longitude: longitude,
        }

        // FileResult가 있는 경우 (이미지가 변경되어 업로드된 경우)
        if (FileResult) {
            requestData.fileId = FileResult.id;
            requestData.profile = FileResult.fileDownloadUri;
        } else if (!isImageDeleted && originalProfileUrl && originalProfileUrl !== NoImage) {
            // FileResult가 없고, 이미지가 삭제되지 않았으며, originalProfileUrl이 유효한 경우
            // (이미지가 변경되지 않았을 때 기존 이미지 정보를 유지하기 위함)
            requestData.profile = originalProfileUrl;
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/profile/modify`, requestData, {
                headers: getAuthHeader(), // 인증 헤더 추가
            });
            // 프로필 저장 완료 확인 창
            alert('프로필이 성공적으로 변경되었습니다😊')
            // 프로필 저장이 완료되면 사용자를 해당 페이지로 이동
            navigate(`/user/${myId}`);

        } catch (error) {
            console.log('프로필 저장 중 에러 발생:', error);
        }
    };


    // 저장 버튼 클릭 시 SaveProfileImage 함수와 saveProfile 함수를 호출
    const handleSaveButtonClick = async () => {
        // const fileResult = await SaveProfileImage();    // SaveProfileImage 함수의 완료를 기다림
        // saveProfile(fileResult);               // SaveProfileImage가 완료된 후 saveProfile 함수 실행

        let fileResult = null;
        // selectedImageFile이 있는 경우에만 이미지 파일 저장 함수를 호출
        if (selectedImageFile) {
            fileResult = await SaveProfileImage(); // SaveProfileImage 함수의 완료를 기다림
        }
        saveProfile(fileResult);
    };


    return (
        <Container component="form">
            <MyPageButton/>
            <Box
                sx={{
                    display: 'flex',
                    gap: 4,
                }}
            >
                <>
                    <Box
                        m={3}
                        sx={{
                            width: 300,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <ProfileImageUploader
                            userId={myId}
                            imagePreview={imagePreview}
                            handleImageChange={handleImageChange}
                            handleCancelImage={handleCancelImage}
                            selectedImageFile={selectedImageFile}
                            saveProfileImage={SaveProfileImage}
                        />


                        <Box
                            m={3}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography sx={{fontWeight: 'bold'}} variant="h5">
                                {profileData.nickname}
                            </Typography>
                            <GenderBirthRange gender={profileData.gender} birthRange={profileData.birthRange}/>
                        </Box>
                        <GetMyPosition setLatitude={setLatitude} setLongitude={setLongitude}/>
                    </Box>
                </>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>

                    <DrinkingAmountInput
                        sojuBottleCount={sojuBottleCount}
                        sojuCupCount={sojuCupCount}
                        setSojuBottleCount={setSojuBottleCount}
                        setSojuCupCount={setSojuCupCount}
                    />


                    <IntroductionInput
                        introduction={introduction}
                        setIntroduction={setIntroduction}
                    />

                    <TagsInput
                        tagOptions={tagOptions}
                        selectedTags={selectedTags}
                        handleTagClick={handleTagClick}
                        isVisible={isVisible}
                        toggleVisibility={handleAddButton}
                        addTagOptions={addTagOptions}
                        addTag={addTag}
                        setAddTag={setAddTag}
                        error={error}
                        handleRemoveTag={handleRemoveTag}
                    />
                </Box>
            </Box>
            <Button
                fullWidth
                sx={{
                    marginTop: 2,
                    backgroundColor: '#ff9b9b',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '5px',
                    padding: '15px',
                    '&:hover': {
                        backgroundColor: '#ff7f7f',
                    },
                }}
                onClick={handleSaveButtonClick}
            >
                프로필 저장하기
            </Button>
        </Container>
    );
};

export default UpdateMyPage;
