package com.yoohoo.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.yoohoo.backend.dto.DogDTO;
import com.yoohoo.backend.dto.DogIdNameDTO;
import com.yoohoo.backend.entity.Dog;
import com.yoohoo.backend.entity.Shelter;
import com.yoohoo.backend.service.DogService;
import com.yoohoo.backend.service.UserService;
import com.yoohoo.backend.service.S3Service;

import jakarta.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;
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

    @Value("${app.domain}")
    private String domain;

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
                    domain + "/api/s3/upload",
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

    @GetMapping("/{dogId}")
    public ResponseEntity<DogDTO> getDogById(@PathVariable Long dogId) {
        Dog dog = dogService.findById(dogId);
        if (dog != null) {
            // 파일 URL을 가져오기 위해 s3Service를 사용
            String imageUrl = s3Service.getFileUrlByEntityTypeAndEntityId(1, dogId);
            DogDTO dogDTO = DogDTO.fromEntity(dog, Optional.ofNullable(imageUrl));
            return ResponseEntity.ok(dogDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping("/{dogId}")
    public ResponseEntity<DogDTO> updateDog(
            @PathVariable Long dogId,
            @RequestPart("dog") String dogJson,
            HttpSession session) {

        // 1. 사용자 인증 및 권한 확인
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Long shelterId = userService.getShelterIdByUserId(userId);
        if (shelterId == null) {
            throw new RuntimeException("(❗권한제한) 등록된 단체가 없습니다.");
        }

        // 2. JSON → DogDTO 변환
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule()); // LocalDate 변환 지원
        DogDTO dogDTO;
        try {
            dogDTO = objectMapper.readValue(dogJson, DogDTO.class);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }

        // 3. Dog 엔티티 조회 (수정 전 정보)
        Dog existingDog = dogService.findById(dogId);
        if (existingDog == null) {
            return ResponseEntity.notFound().build();
        }
        
        // 권한 검증 - 해당 강아지가 이 보호소의 것인지 확인
        if (existingDog.getShelter() == null || !Objects.equals(existingDog.getShelter().getShelterId(), shelterId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(null); // 권한 없음
        }
        
        // 4. 수정할 정보만 업데이트 (null이 아닌 값만)
        if (dogDTO.getName() != null) existingDog.setName(dogDTO.getName());
        if (dogDTO.getBreed() != null) existingDog.setBreed(dogDTO.getBreed());
        if (dogDTO.getGender() != null) existingDog.setGender(dogDTO.getGender());
        if (dogDTO.getAge() != null) existingDog.setAge(dogDTO.getAge());
        if (dogDTO.getWeight() != null) existingDog.setWeight(dogDTO.getWeight());
        if (dogDTO.getIsNeutered() != null) existingDog.setIsNeutered(dogDTO.getIsNeutered());
        if (dogDTO.getEnergetic() != null) existingDog.setEnergetic(dogDTO.getEnergetic());
        if (dogDTO.getFamiliarity() != null) existingDog.setFamiliarity(dogDTO.getFamiliarity());
        if (dogDTO.getIsVaccination() != null) existingDog.setIsVaccination(dogDTO.getIsVaccination());
        if (dogDTO.getStatus() != null) existingDog.setStatus(dogDTO.getStatus());
        if (dogDTO.getAdmissionDate() != null) existingDog.setAdmissionDate(dogDTO.getAdmissionDate());


        // 5. 강아지 정보 저장
        Dog updatedDog = dogService.saveDog(existingDog);
        
        // 6. 이미지 URL 가져오기
        String imageUrl = s3Service.getFileUrlByEntityTypeAndEntityId(1, dogId);

        // 7. 응답 DTO 반환
        DogDTO responseDTO = DogDTO.fromEntity(updatedDog, Optional.ofNullable(imageUrl));
        return ResponseEntity.ok(responseDTO);
    }


    @PostMapping("/{dogId}/imageupload")
    public ResponseEntity<String> uploadDogImage(
        @PathVariable Long dogId,
        @RequestPart("file") MultipartFile file
        ) {
            if (file == null || file.isEmpty()) {
                return ResponseEntity.badRequest().body("파일이 없습니다.");
            }
            
            try {
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.MULTIPART_FORM_DATA);
                
                MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
                body.add("file", file.getResource());
                
                HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
                
                ResponseEntity<String> response = restTemplate.exchange(
                    domain + "/api/s3/upload",
                    HttpMethod.POST,
                    requestEntity,
                    String.class
                    );
                    
                    if (response.getStatusCode().is2xxSuccessful()) {
                        String fileUrl = response.getBody();
                        s3Service.saveFileEntity(file, 1, dogId, fileUrl);
                        return ResponseEntity.ok("업로드 완료: " + fileUrl);
                    } else {
                        return ResponseEntity.status(500).body("S3 업로드 실패: " + response.getStatusCode());
                    }
                    
                } catch (Exception e) {
                    throw new RuntimeException("이미지 업로드 중 예외 발생", e);
                }
            }
}