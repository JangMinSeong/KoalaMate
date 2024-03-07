package com.ssafy.koala.controller;

import com.ssafy.koala.dto.board.BoardWithoutCocktailDto;
import com.ssafy.koala.dto.board.CreateBoardRequestDto;
import com.ssafy.koala.dto.board.ViewBoardResponseDto;
import com.ssafy.koala.dto.file.StoreFileDto;
import com.ssafy.koala.dto.file.UploadFileResponse;
import com.ssafy.koala.dto.user.UserDto;
import com.ssafy.koala.model.BoardModel;
import com.ssafy.koala.model.CocktailModel;
import com.ssafy.koala.model.DrinkModel;
import com.ssafy.koala.model.file.FileMetadata;
import com.ssafy.koala.service.AuthService;
import com.ssafy.koala.service.BoardService;
import com.ssafy.koala.service.CocktailService;
import com.ssafy.koala.service.DrinkService;
import com.ssafy.koala.service.file.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.BeanUtils;
import org.springframework.core.io.Resource;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/board")
@Tag(name="board", description="board controller")
public class BoardController {
	private final BoardService boardService;
	private final DrinkService drinkService;
	private final CocktailService cocktailService;
	private final AuthService authService;
	private final FileStorageService fileStorageService;
	@PersistenceContext
	private EntityManager entityManager;
	public BoardController (BoardService boardService, DrinkService drinkService, CocktailService cocktailService, AuthService authService, FileStorageService fileStorageService) {
		this.boardService = boardService;
		this.drinkService = drinkService;
		this.cocktailService = cocktailService;
        this.authService = authService;
        this.fileStorageService = fileStorageService;
    }

	@GetMapping("/list")
	public Object listBoard(@RequestParam int page, @RequestParam int size, @RequestParam int option, HttpServletRequest request) {
		ResponseEntity response = null;

		if(option > 3 || option <= 0) return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);

		Page<ViewBoardResponseDto> pageEntities = null;

		// 로그인 했을 때만 좋아요 여부 출력
		if(request.getHeader("Authorization") != null) {
			String accessToken = authService.getAccessToken(request);
			UserDto user = authService.extractUserFromToken(accessToken);
			pageEntities = boardService.getPageEntities(page - 1, size, option, user.getId());
		}
		// 로그인 안했을 때는 좋아요 여부 출력 안되는 리스트 출력
		else {
			pageEntities = boardService.getPageEntities(page - 1, size, option);
		}
		List<ViewBoardResponseDto> content = pageEntities.getContent();
		int totalPages = ((Page<?>) pageEntities).getTotalPages();

		Map<String, Object> responseBody = new HashMap<>();
		responseBody.put("content", content);
		responseBody.put("totalPages", totalPages);

		response = new ResponseEntity<>(responseBody, HttpStatus.OK);
		return response;
	}

	@GetMapping("/view")
	public Object viewBoard(@RequestParam long id, HttpServletRequest request) {

		if(request.getHeader("Authorization") != null) {
			String token = authService.getAccessToken(request);
			UserDto user = authService.extractUserFromToken(token);
			return new ResponseEntity<>(boardService.getBoardById(id, user.getId()),HttpStatus.OK);
		}
		else {
			return new ResponseEntity<>(boardService.getBoardByIdWithoutLike(id),HttpStatus.OK);
		}
	}

	@Transactional
	@PostMapping("/write")
	public Object writeBoard(@RequestBody CreateBoardRequestDto board, HttpServletRequest request) {
		String accessToken = authService.getAccessToken(request);
		UserDto userDto = authService.extractUserFromToken(accessToken);

		board.setUserId(userDto.getId());
		board.setNickname(userDto.getNickname());
		BoardModel boardModel = new BoardModel();
		BeanUtils.copyProperties(board, boardModel);
		Optional<FileMetadata> metadata = fileStorageService.findById(board.getFileId());
        metadata.ifPresent(boardModel::setFileMetadata);
		boardService.createBoard(boardModel);

		List<CocktailModel> list = board.getCocktails().stream()
				.map(temp -> {
					DrinkModel drinkModel = drinkService.getDrinkModelById(temp.getDrink().getId());

					CocktailModel insert = new CocktailModel();
					insert.setBoard(boardModel);
					insert.setDrink(drinkModel);
					insert.setProportion(temp.getProportion());
					insert.setUnit(temp.getUnit());
					insert.setId(temp.getId());

					return insert;
				})
				.collect(Collectors.toList());

		cocktailService.saveAllCocktails(list);

		ResponseEntity response = new ResponseEntity<>(boardModel, HttpStatus.OK);
		return response;
	}

	@Transactional
	@PutMapping("/modify/{board_id}")
	public Object modifyBoard(@PathVariable long board_id, @RequestBody CreateBoardRequestDto board) {
		ResponseEntity response = null;

		cocktailService.deleteCocktailsByBoardId(board_id);
		BoardModel boardModel = boardService.updateBoard(board_id, board);
		response = new ResponseEntity<>(boardModel,HttpStatus.OK);

		return response;
	}
	
	@DeleteMapping("/delete/{board_id}")
	public Object deleteBoard(@PathVariable long board_id) {;
		try {
			boardService.deleteBoard(board_id);
			return new ResponseEntity<>("Board with ID " + board_id + " deleted successfully.", HttpStatus.OK);
		} catch (EmptyResultDataAccessException e) {
			// 해당 ID에 해당하는 엔티티가 존재하지 않는 경우
			return new ResponseEntity<>("Board with ID " + board_id + " not found.", HttpStatus.NOT_FOUND);
		} catch (Exception e) {
			// 기타 예외 처리
			return new ResponseEntity<>("Error deleting board with ID " + board_id, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PostMapping("/like")
	public ResponseEntity<?> likeBoard(@RequestBody BoardWithoutCocktailDto dto, HttpServletRequest request) {
		try{
			long board_id = dto.getId();
			String accessToken = authService.getAccessToken(request);
			boolean isLike = boardService.likeBoard(board_id, authService.extractUserFromToken(accessToken).getId());
			return new ResponseEntity<>(Map.of("isLike", isLike), HttpStatus.OK);
		} catch (EmptyResultDataAccessException e) {
			// 해당 ID에 해당하는 엔티티가 존재하지 않는 경우
			return new ResponseEntity<>("Not found board", HttpStatus.NOT_FOUND);
		} catch (Exception e) {
			// 기타 예외 처리
			return new ResponseEntity<>("Error processing like", HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}


	@Operation(summary = "게시글 제목에서 검색", description = "")
	@GetMapping("/search")
	public ResponseEntity<?> searchBoard(@RequestParam int page, @RequestParam int size, @RequestParam String keyword, @RequestParam int option,
		HttpServletRequest request) {
		ResponseEntity response = null;
		Page<ViewBoardResponseDto> pageEntities = null;
		if(option > 3 || option <= 0) return new ResponseEntity<>(null,HttpStatus.NOT_FOUND);
		if(request.getHeader("Authorization") == null) {
			// 로그인 안했을 경우
			pageEntities = boardService.searchAndPageBoards(keyword, page-1, size, option);
		}
		else {
			// 로그인 했을 경우 좋아요 여부 반영
			String accessToken = authService.getAccessToken(request);
			UserDto user = authService.extractUserFromToken(accessToken);
			pageEntities = boardService.searchAndPageBoards(keyword, page-1, size, option, user.getId());
		}
		List<ViewBoardResponseDto> content = pageEntities.getContent();
		int totalPages = ((Page<?>) pageEntities).getTotalPages();

		Map<String, Object> responseBody = new HashMap<>();
		responseBody.put("content", content);
		responseBody.put("totalPages", totalPages);


		response = new ResponseEntity<>(responseBody, HttpStatus.OK);
		return response;
	}

	@Operation(summary = "재료 이름으로 검색", description = "해당 글자 포함된 재료 다")
	@GetMapping("/searchByDrink")
	public ResponseEntity<?> searchBoardByDrink(@RequestParam int page, @RequestParam int size, @RequestParam String drinkName) {
		ResponseEntity response = null;

		Page<ViewBoardResponseDto> pageEntities = boardService.searchBoardsByDrinkName(drinkName, page-1, size);
		List<ViewBoardResponseDto> content = pageEntities.getContent();
		int totalPages = ((Page<?>) pageEntities).getTotalPages();
		long totalElements = pageEntities.getTotalElements(); // 전체 게시글 수를 가져옵니다.


		Map<String, Object> responseBody = new HashMap<>();
		responseBody.put("content", content);
		responseBody.put("totalPages", totalPages);
		responseBody.put("totalElements", totalElements); // 전체 게시글 수를 응답 본문에 추가합니다.

		response = new ResponseEntity<>(responseBody, HttpStatus.OK);
		return response;
	}

	@Operation(summary = "재료 카테고리로 검색", description = "해당 카테고리 재료 포함된 레시피 다")
	@GetMapping("/searchByDrinkCategory")
	public ResponseEntity<?> searchBoardByDrinkCategory(@RequestParam int page, @RequestParam int size, @RequestParam int category) {
		ResponseEntity response = null;

		Page<ViewBoardResponseDto> pageEntities = boardService.searchBoardsByDrinkCategory(category, page-1, size);
		List<ViewBoardResponseDto> content = pageEntities.getContent();
		int totalPages = ((Page<?>) pageEntities).getTotalPages();
		long totalElements = pageEntities.getTotalElements(); // 전체 게시글 수를 가져옵니다.


		Map<String, Object> responseBody = new HashMap<>();
		responseBody.put("content", content);
		responseBody.put("totalPages", totalPages);
		responseBody.put("totalElements", totalElements); // 전체 게시글 수를 응답 본문에 추가합니다.

		response = new ResponseEntity<>(responseBody, HttpStatus.OK);
		return response;
	}

	@PostMapping("/uploadBoardImage")
	public ResponseEntity<?> uploadBoardImage(@RequestParam("file") MultipartFile file, HttpServletRequest request) {

		String accessToken = authService.getAccessToken(request);
		UserDto userDto = authService.extractUserFromToken(accessToken);

		if (file.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("파일을 첨부해주세요.");
		}

		try {
			// 이미지 저장 로직 호출
			String imageUrl = boardService.storeFile(file);

			// 저장된 이미지 URL 반환
			return ResponseEntity.ok().body(Map.of("imageUrl", imageUrl));
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이미지 업로드에 실패했습니다.");
		}
	}

	// 내가 작성한 게시글(레시피) 리스트
	@GetMapping("/mylist")
	public ResponseEntity<?> listMyBoard(@RequestParam int page, @RequestParam int size, HttpServletRequest request) {
		String accessToken = authService.getAccessToken(request);
		UserDto user = authService.extractUserFromToken(accessToken);

		// 페이지 시작은 0부터
		Page<ViewBoardResponseDto> pageEntities = boardService.getMyPageEntities(page-1, size, user.getNickname(), user.getId());
		List<ViewBoardResponseDto> content = pageEntities.getContent();
		int totalPages = pageEntities.getTotalPages();
		long totalElements = pageEntities.getTotalElements(); // 전체 게시글 수를 가져옵니다.

		Map<String, Object> responseBody = new HashMap<>();
		responseBody.put("content", content);
		responseBody.put("totalPages", totalPages);
		responseBody.put("totalElements", totalElements); // 전체 게시글 수를 응답 본문에 추가합니다.

		return new ResponseEntity<>(responseBody, HttpStatus.OK);
	}


	// 내가 좋아요 한 게시글(레시피) 리스트
	@GetMapping("/likelist")
	public ResponseEntity<?> listLikeBoard(@RequestParam int page, @RequestParam int size, HttpServletRequest request) {
		String accessToken = authService.getAccessToken(request);
		UserDto user = authService.extractUserFromToken(accessToken);

		//페이지 시작은 0부터
		Page<ViewBoardResponseDto> pageEntities = boardService.getLikedPageEntities(page-1, size, user.getId());
		List<ViewBoardResponseDto> content = pageEntities.getContent();
		int totalPages = ((Page<?>) pageEntities).getTotalPages();

		Map<String, Object> responseBody = new HashMap<>();
		responseBody.put("content", content);
		responseBody.put("totalPages", totalPages);

		return new ResponseEntity<>(responseBody, HttpStatus.OK);
	}

	// 프론트 요청
	@Operation(summary = "게시글 검색 옵션 넣어서",
			description = "게시글 검색 옵션에 따라 다른 검색 로직 적용, " +
					"1 : 공식레시피, 제목으로 검색, " +
					"2 : 유저레시피, 제목으로 검색, " +
					"3 : 공식레시피, 포함된 재료 이름으로 검색 ")
	@GetMapping("/searchForFront")
	public ResponseEntity<?> searchBoardForFront(@RequestParam int page, @RequestParam int size, @RequestParam String keyword, @RequestParam int option,
												 HttpServletRequest request) {
		ResponseEntity<?> response;
		if (option > 3 || option <= 0) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

		Page<ViewBoardResponseDto> pageEntities;
		if (request.getHeader("Authorization") == null) {
			// 로그인 안 했을 경우
			pageEntities = boardService.searchForFront(keyword, page - 1, size, option, null);
		} else {
			// 로그인 했을 경우 좋아요 여부 반영
			String accessToken = authService.getAccessToken(request);
			UserDto userDto = authService.extractUserFromToken(accessToken);
			Long userId = userDto.getId();

			pageEntities = boardService.searchForFront(keyword, page - 1, size, option, userId);
		}

		List<ViewBoardResponseDto> content = pageEntities.getContent();
		int totalPages = pageEntities.getTotalPages();
		long totalElements = pageEntities.getTotalElements();

		Map<String, Object> responseBody = new HashMap<>();
		responseBody.put("content", content);
		responseBody.put("totalPages", totalPages);
		responseBody.put("totalElements", totalElements);

		response = new ResponseEntity<>(responseBody, HttpStatus.OK);
		return response;
	}

	@GetMapping("/searchByDrinkCountAndCategory")
	public ResponseEntity<?> searchBoardByDrinkCountAndCategory(
			HttpServletRequest request,
			@RequestParam int page,
			@RequestParam int size,
			@RequestParam(required = false) int minDrinks,
			@RequestParam(required = false) int maxDrinks,
			@RequestParam(required = false) Integer category,
			@RequestParam(required = false, defaultValue = "1") Integer option) { // 추가된 매개변수

		ResponseEntity response = null;
		Page<ViewBoardResponseDto> pageEntities = null;

		Long userId = null;

		if(request.getHeader("Authorization") != null) {
			String accessToken = authService.getAccessToken(request);
			UserDto user = authService.extractUserFromToken(accessToken);
			userId = user.getId();
			pageEntities = boardService.searchBoardsByDrinkCountAndCategoryWithOptions(
					minDrinks, maxDrinks, category,
					page - 1, size, option, userId);
		} else {
			pageEntities = boardService.searchBoardsByDrinkCountAndCategoryWithOptions(
					minDrinks, maxDrinks, category,
					page - 1, size, option, userId);
		}



		List<ViewBoardResponseDto> content = pageEntities.getContent();
		int totalPages = pageEntities.getTotalPages();
		long totalElements = pageEntities.getTotalElements();

		Map<String, Object> responseBody = new HashMap<>();
		responseBody.put("content", content);
		responseBody.put("totalPages", totalPages);
		responseBody.put("totalElements", totalElements);

		response = new ResponseEntity<>(responseBody, HttpStatus.OK);
		return response;
	}

	// 백 서버에 파일 업로드
	@PostMapping(value="/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
		StoreFileDto storedFile = fileStorageService.storeFile(file, "board");
		String fileName = storedFile.getFilename();

		String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
				.path("/board/download/")
				.path(fileName)
				.toUriString();

		return ResponseEntity.ok(new UploadFileResponse(storedFile.getId(), fileName, fileDownloadUri, file.getContentType(), file.getSize()));
	}

	// 백 서버에서 파일 다운로드
	@GetMapping("/download/{fileName:.+}")
	public ResponseEntity<Resource> downloadFile(@PathVariable String fileName) {
		// Load file as Resource
		Resource resource = fileStorageService.loadFileAsResource(fileName, "board");

		return ResponseEntity.ok()
				.body(resource);
	}
}
