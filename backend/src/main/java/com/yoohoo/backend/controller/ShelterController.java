package com.yoohoo.backend.controller;

import com.yoohoo.backend.dto.DogListDTO;
import com.yoohoo.backend.dto.ReliabilityResponseDto;
import com.yoohoo.backend.dto.ShelterDetailDTO;
import com.yoohoo.backend.dto.ShelterListDTO;
import com.yoohoo.backend.service.ShelterService;
import com.yoohoo.backend.service.DogService;
import com.yoohoo.backend.service.S3Service;
import com.yoohoo.backend.service.ShelterFinanceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shelter")
public class ShelterController {

    private final ShelterService shelterService;
    private final DogService dogService;
    private final ShelterFinanceService shelterFinanceService;
    private final S3Service s3Service;
    private final RestTemplate restTemplate;

    @Autowired
    public ShelterController(ShelterService shelterService, 
    DogService dogService, ShelterFinanceService shelterFinanceService, 
    S3Service s3Service, RestTemplate restTemplate) {
        this.shelterService = shelterService;
        this.dogService = dogService;
        this.shelterFinanceService = shelterFinanceService;
        this.s3Service = s3Service;
        this.restTemplate = restTemplate;
    }

    @Value("${app.domain}")
    private String domain;

    @GetMapping
    public List<ShelterListDTO> getAllSheltersWithDogCount(
        @RequestParam(required = false) String search,
        @RequestParam(required = false) String sort) {

    List<ShelterListDTO> shelters = shelterService.getAllShelters();

    // 검색
    if (search != null && !search.isBlank()) {
        String lowerSearch = search.toLowerCase();
        shelters = shelters.stream()
                .filter(shelter -> shelter.getName().toLowerCase().contains(lowerSearch))
                .collect(Collectors.toList());
    }
    
        // 2. 정렬
        if ("reliability".equalsIgnoreCase(sort)) {
            shelters.sort((s1, s2) -> Double.compare(s2.getReliability(), s1.getReliability())); // 내림차순
        } else if ("dogcount".equalsIgnoreCase(sort)) {
            shelters.sort((s1, s2) -> Long.compare(s2.getDogCount(), s1.getDogCount())); // 내림차순
        }
        return shelters;
    }

    // 단체 상세 조회 (강아지 목록 제외)
    @GetMapping("/{shelterId}")
    public ShelterDetailDTO getShelterById(@PathVariable Long shelterId) {
        return shelterService.getShelterById(shelterId);
    }


    // 특정 shelterId에 속한 강아지 목록 조회 + 이름 검색 + status 필터링 추가
    @GetMapping("/{shelterId}/dogs")
    public List<DogListDTO> getDogsByShelterId(
            @PathVariable Long shelterId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<Integer> status) {  // ✅ 다중 status를 List로 받음

        List<DogListDTO> dogs = dogService.getDogsByShelterId(shelterId);

        // 🔹 status 필터링 적용
        if (status != null && !status.isEmpty()) {
            dogs = dogs.stream()
                    .filter(dog -> status.contains(dog.getStatus()))  // ✅ status 리스트와 비교
                    .collect(Collectors.toList());
        }

        // 🔹 search 파라미터가 있는 경우 이름 기준 필터링
        if (search != null && !search.isBlank()) {
            String lowerSearch = search.toLowerCase();
            dogs = dogs.stream()
                    .filter(dog -> dog.getName().toLowerCase().contains(lowerSearch))
                    .collect(Collectors.toList());
        }

        return dogs;
    }

    // Shelter-06-01 : shelterUserKey:{shelterId}, shelterAccountNo:{shelterId} 를 Redis에 저장하고 리턴한다.
    @PostMapping("/{shelterId}/accountinfo") 
    public ResponseEntity<Map<String, String>> getAccountInfo(@PathVariable Long shelterId) {
        Map<String, String> result = shelterFinanceService.getAccountAndUserKey(shelterId);
        return ResponseEntity.ok(result);
    }

    // Shelter-06-01 : shelterUserKey:{shelterId}, shelterAccountNo:{shelterId}, shelterCardNo:{shelterId}, shelterCvc:{shelterId} 를 Redis에 저장하고 리턴한다.
    @PostMapping("/{shelterId}/fininfo")
    public ResponseEntity<Map<String, String>> getFullFinanceInfo(@PathVariable Long shelterId) {
        return ResponseEntity.ok(shelterFinanceService.getAccountAndCardFromRedis(shelterId));
    }

    // Shelter-09
    @GetMapping("/{shelterId}/reliability")
    public ResponseEntity<ReliabilityResponseDto> getReliability(@PathVariable Long shelterId) {
        ReliabilityResponseDto dto = shelterService.getReliability(shelterId);
        return ResponseEntity.ok(dto);
    }


    // 보호소 로고 이미지 업로드
    @PostMapping("/{shelterId}/imageupload")
    public ResponseEntity<?> uploadShelterLogo(
            @PathVariable Long shelterId,
            @RequestPart(value = "file", required = false) MultipartFile file) {

        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("파일이 없습니다.");
        }

        String fileUrl = null;
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
                fileUrl = response.getBody();
                s3Service.saveFileEntity(file, 0, shelterId, fileUrl); // entityType을 0으로 설정
            } else {
                throw new RuntimeException("파일 업로드 실패: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new RuntimeException("파일 업로드 실패", e);
        }

        return ResponseEntity.ok("보호소 로고 업로드 성공: " + fileUrl);
    }


}