package com.yoohoo.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.yoohoo.backend.dto.DogDTO;
import com.yoohoo.backend.dto.DogIdNameDTO;
import com.yoohoo.backend.entity.Dog;
import com.yoohoo.backend.entity.Shelter;
import com.yoohoo.backend.service.DogService;
import com.yoohoo.backend.service.UserService;
import com.yoohoo.backend.service.S3Service;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/dogs")
public class DogController {

    private final DogService dogService;
    private final UserService userService;  // 로그인한 사용자의 shelterId를 얻기 위해 필요
    private final S3Service s3Service;
    private final RestTemplate restTemplate;

    @Autowired
    public DogController(DogService dogService, UserService userService, S3Service s3Service, RestTemplate restTemplate) {
        this.dogService = dogService;
        this.userService = userService;
        this.s3Service = s3Service;
        this.restTemplate = restTemplate;
    }


    @GetMapping("/names")
    public ResponseEntity<List<DogIdNameDTO>> getDogsByUserShelter(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        
        if (userId == null) {
            return ResponseEntity.badRequest().build(); // 사용자 ID가 없으면 400 Bad Request
        }
    
        Long shelterId = userService.getShelterIdByUserId(userId);
        
        if (shelterId == null) {
            throw new RuntimeException("(❗권한제한) 등록된 단체가 없습니다.");
        }
    
        List<DogIdNameDTO> dogs = dogService.getDogIdAndNamesByShelterId(shelterId);
        return ResponseEntity.ok(dogs);
    }
    @PostMapping("/register")
    public ResponseEntity<DogDTO> registerDogWithImage(
        @RequestPart("dog") String dogJson,
        @RequestPart(value = "file", required = false) MultipartFile file,
        HttpSession session
    ) {
        // 1. 사용자 인증
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    
        Long shelterId = userService.getShelterIdByUserId(userId);
        if (shelterId == null) throw new RuntimeException("(❗권한제한) 등록된 단체가 없습니다.");
    
        // 2. JSON → DTO 변환
        ObjectMapper objectMapper = new ObjectMapper();
        DogDTO dogDTO;
        try {
            dogDTO = objectMapper.readValue(dogJson, DogDTO.class);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    
        // 3. DTO → Entity 변환
        Shelter shelter = new Shelter();
        shelter.setShelterId(shelterId);
        Dog dog = dogDTO.toEntity(shelter);
    
        // 4. 강아지 저장
        Dog savedDog = dogService.saveDog(dog);
        Optional<String> fileUrlOptional = Optional.empty();

        // 5. 이미지 업로드 (있다면)
        if (file != null && !file.isEmpty()) {
            try {
                // S3 업로드
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.MULTIPART_FORM_DATA);
    
                MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
                body.add("file", file.getResource());
    
                HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
    
                ResponseEntity<String> response = restTemplate.exchange(
                    "http://localhost:8080/s3/upload",
                    HttpMethod.POST,
                    requestEntity,
                    String.class
                );
    
                if (response.getStatusCode().is2xxSuccessful()) {
                    String fileUrl = response.getBody(); // ← 실제 S3 URL
                    s3Service.saveFileEntity(file, 1, savedDog.getDogId(), fileUrl);
                    fileUrlOptional = Optional.of(fileUrl);
                } else {
                    throw new RuntimeException("이미지 업로드 실패: " + response.getStatusCode());
                }
    
            } catch (Exception e) {
                throw new RuntimeException("이미지 업로드 중 예외 발생", e);
            }
        }
    
        // 6. 응답 DTO 반환
        DogDTO responseDTO = DogDTO.fromEntity(savedDog, fileUrlOptional);
        return ResponseEntity.ok(responseDTO);
    }
       
    
    @GetMapping("/status")
    public ResponseEntity<Map<String, Integer>> getstatus (HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        
        if (userId == null) {
            return ResponseEntity.badRequest().build(); // 사용자 ID가 없으면 400 Bad Request
    }

    Long shelterId = userService.getShelterIdByUserId(userId);
    
    if (shelterId == null) {
        throw new RuntimeException("(❗권한제한) 등록된 단체가 없습니다.");
    }
    
    
    Map<String, Integer> statuses = dogService.getDogCountByShelterId(shelterId);
    return ResponseEntity.ok(statuses);
    }

}