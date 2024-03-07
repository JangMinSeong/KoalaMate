// import React, { useState } from 'react';
//
// const SearchFilter = () => {
// 	const [searchTerm, setSearchTerm] = useState('');
//
// 	const handleSearch = (e) => {
// 		setSearchTerm(e.target.value);
// 	};
//
// 	// 백에서 drinksData name 가져오는 로직
// 	// 백에서 drinksData category 가져오는 로직
//
// 	const filterDrinks = () => {
// 		return drinksData.filter((drink) =>
// 				drink.toLowerCase().includes(searchTerm.toLowerCase())
// 		);
// 	};
//
// 	const searchResults = filterDrinks();
//
// 	return (
// 			<>
// 				<input
// 						type="text"
// 						placeholder="술을 검색하세요..."
// 						value={searchTerm}
// 						onChange={handleSearch}
// 				/>
//
// 				<ul>
// 					{searchResults.map((result, index) => (
// 							<li key={index}>{result}</li>
// 					))}
// 				</ul>
// 			</>
// 	);
// };
//
// export default SearchFilter;
