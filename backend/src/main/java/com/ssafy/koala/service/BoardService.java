package com.ssafy.koala.service;

import com.ssafy.koala.dto.CommentDto;
import com.ssafy.koala.dto.board.BoardDto;
import com.ssafy.koala.dto.board.CreateBoardRequestDto;
import com.ssafy.koala.dto.board.ViewBoardResponseDto;
import com.ssafy.koala.dto.cocktail.CocktailWithDrinkDto;
import com.ssafy.koala.dto.drink.DrinkWithoutCocktailDto;
import com.ssafy.koala.model.BoardModel;
import com.ssafy.koala.model.CocktailModel;
import com.ssafy.koala.model.DrinkModel;
import com.ssafy.koala.model.LikeModel;
import com.ssafy.koala.model.user.UserModel;
import com.ssafy.koala.repository.*;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class BoardService {

	private final BoardRepository boardRepository;
	private final DrinkRepository drinkRepository;
	private final CocktailRepository cocktailRepository;
	private final LikeRepository likeRepository;

	private final Path fileStorageLocation;
	public BoardService(BoardRepository boardRepository, DrinkRepository drinkRepository, CocktailRepository cocktailRepository,
                        LikeRepository likeRepository) {
		this.boardRepository = boardRepository;
		this.drinkRepository = drinkRepository;
		this.cocktailRepository = cocktailRepository;
		this.likeRepository = likeRepository;


		this.fileStorageLocation = Paths.get("frontend/public/BoardFileUploads").toAbsolutePath().normalize();
		try {
			Files.createDirectories(this.fileStorageLocation); // 디렉토리가 없다면 생성
		} catch (Exception ex) {
			throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
		}
	}
	public List<BoardDto> getAllEntities() {
		List<BoardModel> entities = boardRepository.findAll();
		return entities.stream()
				.map(this::convertToDto)
				.collect(Collectors.toList());
	}

	public Page<ViewBoardResponseDto> getPageEntities(int page, int size, int option) {
		Sort sort = Sort.by(Sort.Direction.DESC, "id");
		Pageable pageable = PageRequest.of(page, size, sort);

		Page<BoardModel> entities;
		switch(option) {
			case 1: entities = boardRepository.findAll(pageable); break;    //전체
			case 2: entities = boardRepository.findByNickname("admin",pageable); break;  //관리자
			default: entities = boardRepository.findUserBoard(pageable);   //유저
		}


		List<ViewBoardResponseDto> result = entities.getContent().stream()
				.map(board -> {
					ViewBoardResponseDto boardDto = new ViewBoardResponseDto();
					if (board != null) { // BoardModel이 null이 아닌지 확인
						BeanUtils.copyProperties(board, boardDto);

						List<CocktailWithDrinkDto> cocktails = board.getCocktails() != null ? board.getCocktails().stream()
								.map(cocktail -> {
									CocktailWithDrinkDto cocktailDto = new CocktailWithDrinkDto();
									if (cocktail != null && cocktail.getDrink() != null) { // cocktail과 drink가 null이 아닌지 확인
										BeanUtils.copyProperties(cocktail, cocktailDto);
										DrinkWithoutCocktailDto drinkDto = new DrinkWithoutCocktailDto();
										BeanUtils.copyProperties(cocktail.getDrink(), drinkDto);
										cocktailDto.setDrink(drinkDto);
									}
									return cocktailDto;
								})
								.collect(Collectors.toList()) : Collections.emptyList();

						boardDto.setCocktails(cocktails);
						boardDto.setComments(null);
					}
					return boardDto;
				})
				.collect(Collectors.toList());

		return new PageImpl<>(result, pageable, entities.getTotalElements());
	}

	public BoardDto getBoardDtoById(Long id) {
		BoardModel board = boardRepository.findById(id).orElse(null);
		return (board != null) ? convertToDto(board) : null;
	}

	public ViewBoardResponseDto getBoardById(Long id, Long userId) {
		BoardModel board = boardRepository.findById(id).orElse(null);

		if (board != null) {
			ViewBoardResponseDto boardDto = new ViewBoardResponseDto();
			BeanUtils.copyProperties(board, boardDto);

			// 현재 유저가 게시글 좋아요 했는지 확인
			UserModel user = new UserModel();
			user.setId(userId);
			boolean isLike = likeRepository.existsByUserAndBoard(user, board);
			boardDto.setLiked(isLike);

			// 좋아요 수 확인
			long likeCount = likeRepository.countByBoard_Id(id);
			boardDto.setLikeCount(likeCount);

			List<CocktailWithDrinkDto> list = board.getCocktails().stream()
					.map(temp -> {
						CocktailWithDrinkDto insert = new CocktailWithDrinkDto();
						BeanUtils.copyProperties(temp, insert);

						DrinkWithoutCocktailDto drinkDto = new DrinkWithoutCocktailDto();
						BeanUtils.copyProperties(temp.getDrink(), drinkDto);

						insert.setDrink(drinkDto);
						return insert;
					})
					.collect(Collectors.toList());

			boardDto.setCocktails(list);
			List<CommentDto> comments = board.getComments().stream()
					.map(temp-> {
						CommentDto insert = new CommentDto();
						BeanUtils.copyProperties(temp, insert);
						return insert;
					}).collect(Collectors.toList());
			boardDto.setComments(comments);
			return boardDto;
		}

		return null;
	}

	public BoardDto createBoard(BoardModel boardModel) {
		//모자란 부분 추가
		BoardModel savedBoard = boardRepository.save(boardModel);

		return convertToDto(savedBoard);
	}

	public BoardModel updateBoard(Long id, CreateBoardRequestDto boardDto) {
		BoardModel existingBoard = boardRepository.findById(id).orElse(null);

		if (existingBoard != null) {
			BeanUtils.copyProperties(boardDto, existingBoard, "id");
			BoardModel updatedBoard = boardRepository.save(existingBoard);
			updatedBoard.setCocktails(null);
			List<CocktailModel> cocktails = boardDto.getCocktails().stream()
					.map(temp -> {
						Optional<DrinkModel> drinkModel = drinkRepository.findById(temp.getDrink().getId());
						CocktailModel insert = new CocktailModel();
						insert.setId(temp.getId());
						insert.setUnit(temp.getUnit());
						insert.setProportion(temp.getProportion());
						insert.setBoard(updatedBoard);
						drinkModel.ifPresent(insert::setDrink);
						return insert;
					})
					.collect(Collectors.toList());

			cocktailRepository.saveAll(cocktails);

			return updatedBoard;
		}

		return null;
	}

	public void deleteBoard(Long id) {
		boardRepository.deleteById(id);
	}

	public boolean likeBoard(Long id, Long myId) {
		UserModel user = new UserModel();
		user.setId(myId);
		BoardModel board = new BoardModel();
		board.setId(id);
		// 유저가 게시글을 좋아요 했던 기록이 있는가?
		boolean exists = likeRepository.existsByUserAndBoard(user, board);
		if(exists) {
			// 좋아요 취소
			likeRepository.deleteByUserAndBoard(user, board);
			return false;
		} else {
			// 좋아요 수행
			LikeModel like = new LikeModel();
			like.setUser(user);
			like.setBoard(board);
			likeRepository.save(like);
			return true;
		}
	}

	public BoardDto convertToDto(Object board) {
		BoardDto boardDto = new BoardDto();
		BeanUtils.copyProperties(board, boardDto);
		return boardDto;
	}

	public BoardModel convertToBoard(Object boardDto) {
		BoardModel board = new BoardModel();
		if (boardDto != null) {
			BeanUtils.copyProperties(boardDto, board);
		}
		return board;
	}

	public Page<ViewBoardResponseDto> searchAndPageBoards(String keyword, int page, int size, int option) {
		Sort sort = Sort.by(Sort.Direction.DESC, "id");
		PageRequest pageable = PageRequest.of(page, size, sort);

		// 검색 및 페이징을 위한 Specification을 사용
		Specification<BoardModel> spec;
		switch(option) {
			case 1: spec = BoardSpecifications.search(keyword); break;  //전체
			case 2: spec = BoardSpecifications.search(keyword, "admin", 1); break;  //관리자
			default : spec = BoardSpecifications.search(keyword, "admin", -1); break;  //유저
		}

		Page<BoardModel> pageResult = boardRepository.findAll(spec, pageable);

		List<ViewBoardResponseDto> result = pageResult.getContent().stream()
				.map(board -> {
					ViewBoardResponseDto boardDto = new ViewBoardResponseDto();
					BeanUtils.copyProperties(board, boardDto);

					List<CocktailWithDrinkDto> cocktails = board.getCocktails().stream()
							.map(temp -> {
								CocktailWithDrinkDto insert = new CocktailWithDrinkDto();
								BeanUtils.copyProperties(temp, insert);

								DrinkWithoutCocktailDto drinkDto = new DrinkWithoutCocktailDto();
								BeanUtils.copyProperties(temp.getDrink(), drinkDto);

								insert.setDrink(drinkDto);
								return insert;
							})
							.collect(Collectors.toList());


					boardDto.setCocktails(cocktails);
					boardDto.setComments(null);
					return boardDto;
				})
				.collect(Collectors.toList());

		return new PageImpl<>(result, pageable, pageResult.getTotalElements());
	}

	public ViewBoardResponseDto getBoardByIdWithoutLike(Long id) {
		BoardModel board = boardRepository.findById(id).orElse(null);

		if (board != null) {
			ViewBoardResponseDto boardDto = new ViewBoardResponseDto();
			BeanUtils.copyProperties(board, boardDto);

			List<CocktailWithDrinkDto> list = board.getCocktails().stream()
					.map(temp -> {
						CocktailWithDrinkDto insert = new CocktailWithDrinkDto();
						BeanUtils.copyProperties(temp, insert);

						DrinkWithoutCocktailDto drinkDto = new DrinkWithoutCocktailDto();
						BeanUtils.copyProperties(temp.getDrink(), drinkDto);

						insert.setDrink(drinkDto);
						return insert;
					})
					.collect(Collectors.toList());

			boardDto.setCocktails(list);
			List<CommentDto> comments = board.getComments().stream()
					.map(temp -> {
						CommentDto insert = new CommentDto();
						BeanUtils.copyProperties(temp, insert);
						return insert;
					}).collect(Collectors.toList());
			boardDto.setComments(comments);
			return boardDto;
		}
		return null;
	}

	public String storeFile(MultipartFile file) throws IOException {

		// 파일 이름 설정 (랜덤한 영어 10자리 + 원래 확장자)
		String randomEnglish = RandomStringUtils.randomAlphabetic(10);
		String originalFilename = file.getOriginalFilename();
		String extension = originalFilename.substring(originalFilename.lastIndexOf("."));

		String fileName = randomEnglish + extension;

		// 파일 저장 경로 설정
		Path targetLocation = this.fileStorageLocation.resolve(fileName);

		// 파일 저장
		Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

		return "BoardFileUploads/" + fileName;
	}

	public Page<ViewBoardResponseDto> getMyPageEntities(int page, int size, String nickname, Long userId) {
		Sort sort = Sort.by(Sort.Direction.DESC, "id");
		Pageable pageable = PageRequest.of(page, size, sort);
		Page<BoardModel> entities = boardRepository.findBoardById(userId, pageable);


		List<ViewBoardResponseDto> result = entities.stream()
				.map(board -> {
					ViewBoardResponseDto boardDto = new ViewBoardResponseDto();
					BeanUtils.copyProperties(board, boardDto);

					List<CocktailWithDrinkDto> cocktails = board.getCocktails().stream()
							.map(temp -> {
								CocktailWithDrinkDto insert = new CocktailWithDrinkDto();
								BeanUtils.copyProperties(temp, insert);

								DrinkWithoutCocktailDto drinkDto = new DrinkWithoutCocktailDto();
								BeanUtils.copyProperties(temp.getDrink(), drinkDto);

								insert.setDrink(drinkDto);
								return insert;
							})
							.collect(Collectors.toList());


					boardDto.setCocktails(cocktails);
					boardDto.setComments(null);
					// 좋아요 여부 확인
					boardDto.setLiked(board.getLikes().stream()
							.anyMatch(like -> like.getUser().getId().equals(userId)));
					return boardDto;
				})
				.collect(Collectors.toList());

		return new PageImpl<>(result, pageable, entities.getTotalElements());
	}

	public Page<ViewBoardResponseDto> getLikedPageEntities(int page, int size, Long userId) {
		Sort sort = Sort.by(Sort.Direction.DESC, "id");
		Pageable pageable = PageRequest.of(page, size, sort);

		// 사용자가 좋아요 한 board_id 리스트를 가져온다.
		List<Long> likedBoardIds = likeRepository.findLikedBoardIdsByUserId(userId);

		// (추가) 좋아요 없으면 빈 페이지 반환하십쇼
		if (likedBoardIds.isEmpty()) {
			return new PageImpl<>(Collections.emptyList(), pageable, 0);
		}
		// Specification을 사용하여 조건에 맞는 BoardModel 조회
		Page<BoardModel> entities = boardRepository.findAll(BoardSpecifications.boardIsLikedByUser(likedBoardIds), pageable);

		List<ViewBoardResponseDto> result = entities.stream()
				.map(board -> {
					ViewBoardResponseDto boardDto = new ViewBoardResponseDto();
					BeanUtils.copyProperties(board, boardDto);
					boardDto.setLiked(true);

					List<CocktailWithDrinkDto> cocktails = board.getCocktails().stream()
							.map(temp -> {
								CocktailWithDrinkDto insert = new CocktailWithDrinkDto();
								BeanUtils.copyProperties(temp, insert);

								DrinkWithoutCocktailDto drinkDto = new DrinkWithoutCocktailDto();
								BeanUtils.copyProperties(temp.getDrink(), drinkDto);

								insert.setDrink(drinkDto);
								return insert;
							})
							.collect(Collectors.toList());


					boardDto.setCocktails(cocktails);
					boardDto.setComments(null);
					return boardDto;
				})
				.collect(Collectors.toList());

		return new PageImpl<>(result, pageable, entities.getTotalElements());
	}

	@Transactional
	public Page<ViewBoardResponseDto> searchBoardsByDrinkName(String drinkName, int page, int size) {
		Sort sort = Sort.by(Sort.Direction.DESC, "id");
		PageRequest pageable = PageRequest.of(page, size, sort);

		//Specification<BoardModel> spec = BoardSpecifications.withDrinkName(drinkName);
		Page<BoardModel> pageResult = boardRepository.findBoardByDrinkName(drinkName, pageable);

		// 결과 매핑 로직은 동일하게 유지
		List<ViewBoardResponseDto> result = pageResult.getContent().stream()
				.map(board -> {
					ViewBoardResponseDto boardDto = new ViewBoardResponseDto();
					BeanUtils.copyProperties(board, boardDto);

					List<CocktailWithDrinkDto> cocktails = board.getCocktails().stream()
							.map(temp -> {
								CocktailWithDrinkDto insert = new CocktailWithDrinkDto();
								BeanUtils.copyProperties(temp, insert);

								DrinkWithoutCocktailDto drinkDto = new DrinkWithoutCocktailDto();
								BeanUtils.copyProperties(temp.getDrink(), drinkDto);

								insert.setDrink(drinkDto);
								return insert;
							})
							.collect(Collectors.toList());

					boardDto.setCocktails(cocktails);
					boardDto.setComments(null);
					return boardDto;
				})
				.collect(Collectors.toList());

		return new PageImpl<>(result, pageable, pageResult.getTotalElements());
	}

	@Transactional
	public Page<ViewBoardResponseDto> searchBoardsByDrinkCategory(int category, int page, int size) {
		Sort sort = Sort.by(Sort.Direction.DESC, "id");
		PageRequest pageable = PageRequest.of(page, size, sort);

		//Specification<BoardModel> spec = BoardSpecifications.withDrinkName(drinkName);
		Page<BoardModel> pageResult = boardRepository.findBoardByDrinkCategory(category, pageable);

		// 결과 매핑 로직은 동일하게 유지
		List<ViewBoardResponseDto> result = pageResult.getContent().stream()
				.map(board -> {
					ViewBoardResponseDto boardDto = new ViewBoardResponseDto();
					BeanUtils.copyProperties(board, boardDto);

					List<CocktailWithDrinkDto> cocktails = board.getCocktails().stream()
							.map(temp -> {
								CocktailWithDrinkDto insert = new CocktailWithDrinkDto();
								BeanUtils.copyProperties(temp, insert);

								DrinkWithoutCocktailDto drinkDto = new DrinkWithoutCocktailDto();
								BeanUtils.copyProperties(temp.getDrink(), drinkDto);

								insert.setDrink(drinkDto);
								return insert;
							})
							.collect(Collectors.toList());

					boardDto.setCocktails(cocktails);
					boardDto.setComments(null);
					return boardDto;
				})
				.collect(Collectors.toList());

		return new PageImpl<>(result, pageable, pageResult.getTotalElements());
	}

	// 로그인 했을 시, 본인의 좋아요 여부 반영한 전체 게시글 목록 출력
	public Page<ViewBoardResponseDto> getPageEntities(int page, int size, int option, Long userId) {
		Sort sort = Sort.by(Sort.Direction.DESC, "id");
		Pageable pageable = PageRequest.of(page, size, sort);

		Page<BoardModel> entities;
		switch(option) {
			case 1: entities = boardRepository.findAll(pageable); break;    //전체
			case 2: entities = boardRepository.findByNickname("admin",pageable); break;  //관리자
			default: entities = boardRepository.findUserBoard(pageable);   //유저
		}


		List<ViewBoardResponseDto> result = entities.getContent().stream()
				.map(board -> {
					ViewBoardResponseDto boardDto = new ViewBoardResponseDto();
					if (board != null) { // BoardModel이 null이 아닌지 확인
						BeanUtils.copyProperties(board, boardDto);

						List<CocktailWithDrinkDto> cocktails = board.getCocktails() != null ? board.getCocktails().stream()
								.map(cocktail -> {
									CocktailWithDrinkDto cocktailDto = new CocktailWithDrinkDto();
									if (cocktail != null && cocktail.getDrink() != null) { // cocktail과 drink가 null이 아닌지 확인
										BeanUtils.copyProperties(cocktail, cocktailDto);
										DrinkWithoutCocktailDto drinkDto = new DrinkWithoutCocktailDto();
										BeanUtils.copyProperties(cocktail.getDrink(), drinkDto);
										cocktailDto.setDrink(drinkDto);
									}
									return cocktailDto;
								})
								.collect(Collectors.toList()) : Collections.emptyList();

						boardDto.setCocktails(cocktails);
						boardDto.setComments(null);
						// 좋아요 여부 확인
						boardDto.setLiked(board.getLikes().stream()
								.anyMatch(like -> like.getUser().getId().equals(userId)));
					}
					return boardDto;
				})
				.collect(Collectors.toList());

		return new PageImpl<>(result, pageable, entities.getTotalElements());
	}

	// 로그인 했을 때, 유저의 좋아요 여부가 반영된 검색 결과
	public Page<ViewBoardResponseDto> searchAndPageBoards(String keyword, int page, int size, int option, Long userId) {
		Sort sort = Sort.by(Sort.Direction.DESC, "id");
		PageRequest pageable = PageRequest.of(page, size, sort);

		// 검색 및 페이징을 위한 Specification을 사용
		Specification<BoardModel> spec;
		switch(option) {
			case 1: spec = BoardSpecifications.search(keyword); break;  //전체
			case 2: spec = BoardSpecifications.search(keyword, "admin", 1); break;  //관리자
			default : spec = BoardSpecifications.search(keyword, "admin", -1); break;  //유저
		}

		Page<BoardModel> pageResult = boardRepository.findAll(spec, pageable);

		List<ViewBoardResponseDto> result = pageResult.getContent().stream()
				.map(board -> {
					ViewBoardResponseDto boardDto = new ViewBoardResponseDto();
					BeanUtils.copyProperties(board, boardDto);

					List<CocktailWithDrinkDto> cocktails = board.getCocktails().stream()
							.map(temp -> {
								CocktailWithDrinkDto insert = new CocktailWithDrinkDto();
								BeanUtils.copyProperties(temp, insert);

								DrinkWithoutCocktailDto drinkDto = new DrinkWithoutCocktailDto();
								BeanUtils.copyProperties(temp.getDrink(), drinkDto);

								insert.setDrink(drinkDto);
								return insert;
							})
							.collect(Collectors.toList());


					boardDto.setCocktails(cocktails);
					boardDto.setComments(null);
					boardDto.setLiked(board.getLikes().stream()
							.anyMatch(like -> like.getUser().getId().equals(userId)));
					return boardDto;
				})
				.collect(Collectors.toList());

		return new PageImpl<>(result, pageable, pageResult.getTotalElements());
	}

	public List<Long> findAllLikedBoardIdsByUserId(Long userId) {
		return likeRepository.findAllLikedBoardIdsByUserId(userId);
	}



	//프론트 요청
		public Page<ViewBoardResponseDto> searchForFront(String keyword, int page, int size, int option, Long userId) {
			Sort sort = Sort.by(Sort.Direction.DESC, "id");
			PageRequest pageable = PageRequest.of(page, size, sort);

			Specification<BoardModel> spec;
			switch (option) {
				case 1:
					// 공식 레시피에서 검색
					spec = BoardSpecifications.searchOnlyTitle(keyword).and(BoardSpecifications.searchByNickname("admin"));
					break;
				case 2:
					// 일반 유저가 쓴 글에서 검색
					spec = BoardSpecifications.searchOnlyTitle(keyword).and(BoardSpecifications.searchByNickname("admin", false));
					break;
//				case 3:
//					// Option 3: Search all drinks' names
//					spec = BoardSpecifications.withDrinkName(keyword);
//					break;
				case 3:
					// 공식 레시피중 해당 재료 포함된 레시피
					spec = BoardSpecifications.withDrinkName(keyword).and(BoardSpecifications.searchByNickname("admin"));
					break;
				default:
					throw new IllegalArgumentException("Invalid search option");
			}

			Page<BoardModel> pageResult = boardRepository.findAll(spec, pageable);
			List<ViewBoardResponseDto> result = mapBoardModelToDto(pageResult, userId); // Assuming this method maps BoardModel to ViewBoardResponseDto

			return new PageImpl<>(result, pageable, pageResult.getTotalElements());
		}



	private List<ViewBoardResponseDto> mapBoardModelToDto(Page<BoardModel> pageResult, Long userId) {
		return pageResult.getContent().stream()
				.map(board -> {
					ViewBoardResponseDto dto = new ViewBoardResponseDto();
					BeanUtils.copyProperties(board, dto);

					// 'cocktails' 정보를 처리합니다.
					List<CocktailWithDrinkDto> cocktailDtos = board.getCocktails().stream().map(cocktail -> {
						CocktailWithDrinkDto cocktailDto = new CocktailWithDrinkDto();
						BeanUtils.copyProperties(cocktail, cocktailDto);

						DrinkWithoutCocktailDto drinkDto = new DrinkWithoutCocktailDto();
						BeanUtils.copyProperties(cocktail.getDrink(), drinkDto);
						cocktailDto.setDrink(drinkDto);

						return cocktailDto;
					}).collect(Collectors.toList());

					dto.setCocktails(cocktailDtos);

					// 유저가 좋아요 한 게시글 여부를 확인
					boolean isLiked = board.getLikes().stream()
							.anyMatch(like -> like.getUser().getId().equals(userId));
					dto.setLiked(isLiked);

					return dto;
				})
				.collect(Collectors.toList());
	}
	public Page<ViewBoardResponseDto> searchBoardsByDrinkCountAndCategoryWithOptions(
			int minDrinks, int maxDrinks, Integer category, int page, int size, Integer option, Long userId) {
		Sort sort = Sort.by(Sort.Direction.DESC, "id");
		PageRequest pageable = PageRequest.of(page, size, sort);

		// 기본 검색 수행

		Page<BoardModel> pageResult;


		if (category == null) {
			// category가 null일 경우의 로직
			switch (option) {
				case 2 -> pageResult = boardRepository.findByAdminWithDrinkCountInRange("admin", minDrinks, maxDrinks, pageable);
				case 3 -> pageResult = boardRepository.findByNonAdminWithDrinkCountInRange("admin", minDrinks, maxDrinks, pageable);
				default -> pageResult = boardRepository.findByDrinkCountInRange(minDrinks, maxDrinks, pageable);
			}


			
		} else {
			// category가 null이 아닐 경우의 로직
			switch (option) {
				case 2 -> pageResult = boardRepository.findByAdminAndCategoryWithDrinkCountInRange("admin", minDrinks, maxDrinks, category, pageable);
				case 3 -> pageResult = boardRepository.findByNonAdminAndCategoryWithDrinkCountInRange("admin", minDrinks, maxDrinks, category, pageable);
				default -> pageResult = boardRepository.findByCategoryWithDrinkCountInRange(minDrinks, maxDrinks, category, pageable);
			}
		}


		// 카테고리 조건으로 필터링하는 부분 추가
		Stream<BoardModel> filteredBoardsStream = pageResult.getContent().stream()
				.filter(board -> board.getCocktails().stream()
						.anyMatch(cocktail -> category == null || cocktail.getDrink().getCategory() == category));

		// 결과 변환
		List<ViewBoardResponseDto> result = pageResult.getContent().stream()
				.map(board -> {
					ViewBoardResponseDto boardDto = new ViewBoardResponseDto();
					BeanUtils.copyProperties(board, boardDto);

					List<CocktailWithDrinkDto> cocktails = board.getCocktails().stream()
							.map(temp -> {
								CocktailWithDrinkDto insert = new CocktailWithDrinkDto();
								BeanUtils.copyProperties(temp, insert);

								DrinkWithoutCocktailDto drinkDto = new DrinkWithoutCocktailDto();
								BeanUtils.copyProperties(temp.getDrink(), drinkDto);

								insert.setDrink(drinkDto);
								return insert;
							})
							.collect(Collectors.toList());


					boardDto.setCocktails(cocktails);
					boardDto.setComments(null);
					boardDto.setLiked(board.getLikes().stream()
							.anyMatch(like -> like.getUser().getId().equals(userId)));
					return boardDto;
				})
				.collect(Collectors.toList());

		return new PageImpl<>(result, pageable, pageResult.getTotalElements());
	}


}
