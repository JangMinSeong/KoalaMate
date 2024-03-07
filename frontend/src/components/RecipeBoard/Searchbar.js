import React from 'react';
import styles from './Searchbar.module.css';
import SearchIcon from '@mui/icons-material/Search';

const Searchbar = ({ setIsSearch, setTerm, term }) => {
    const handleInputChange = (e) => {
        setTerm(e.target.value);
        // 검색어를 지웠을 경우 바로 검색 결과를 숨깁니다.
        if (e.target.value === '') {
            setIsSearch(false);
        }
    };

    // 검색 실행 함수
    const executeSearch = () => {
        if (term.trim() !== '') {
            setIsSearch(true);
        } else {
            setIsSearch(false);
        }
    };

    // 엔터 키 이벤트 핸들러
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            executeSearch();
        }
    };

    // 버튼 클릭 이벤트 핸들러
    const handleClick = () => {
        executeSearch();
    };

    return (
        <div className={styles.searchContainer}>
            <SearchIcon className={styles.searchIcon}/>
            <input
                className={styles.searchInput}
                placeholder="레시피를 검색해보세요"
                value={term}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
            />
            <button className={styles.searchButton} onClick={handleClick}>검색</button>
        </div>
    );
};

export default Searchbar;
