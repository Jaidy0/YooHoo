package com.yoohoo.backend.controller;

import com.yoohoo.backend.dto.TransferRequestDTO;
import com.yoohoo.backend.dto.TransferResponseDTO;
import com.yoohoo.backend.entity.Donation;
import com.yoohoo.backend.entity.Dog;
import com.yoohoo.backend.entity.Shelter;
import com.yoohoo.backend.entity.User;
import com.yoohoo.backend.service.DonationService;
import com.yoohoo.backend.service.DogService;
import com.yoohoo.backend.service.ShelterService;
import com.yoohoo.backend.service.UserService;
import com.yoohoo.backend.service.FinanceService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.yoohoo.backend.dto.DonationDTO;
import com.yoohoo.backend.dto.DogListDTO;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    @Autowired
    private DonationService donationService;

    @Autowired
    private DogService dogService;

    @Autowired
    private ShelterService shelterService;

    @Autowired
    private UserService userService;

    @Autowired
    private StringRedisTemplate redisTemplate; // Redis 클라이언트

    @Autowired
    private FinanceService financeService;
    
    @GetMapping
    public ResponseEntity<List<DonationDTO>> getDonations(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        System.out.println("User ID from session: " + userId);
        
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        List<Donation> donations = donationService.getDonationsByUserId(userId);
        List<DonationDTO> donationDTOs = donations.stream().map(donation -> {
            DonationDTO dto = new DonationDTO();
            dto.setDonationId(donation.getDonationId());
            dto.setDonationAmount(donation.getDonationAmount());
            dto.setTransactionUniqueNo(donation.getTransactionUniqueNo());
            dto.setDonationDate(donation.getDonationDate());
            dto.setDepositorName(donation.getDepositorName());
            dto.setCheeringMessage(donation.getCheeringMessage());
            dto.setUserNickname(donation.getUser().getNickname());
            dto.setDogName(donation.getDog() != null ? donation.getDog().getName() : null);
            dto.setShelterName(donation.getShelter() != null ? donation.getShelter().getName() : null);
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(donationDTOs);
    }

    // 날짜 범위에 따른 후원 내역 조회
    @PostMapping("/filter")
    public ResponseEntity<List<DonationDTO>> getDonationsByDateRange(
            HttpSession session,
            @RequestBody Map<String, String> dateRange) {

        Long userId = (Long) session.getAttribute("userId");
        System.out.println("User ID from session: " + userId);

        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        LocalDate startDate = LocalDate.parse(dateRange.get("startDate"));
        LocalDate endDate = LocalDate.parse(dateRange.get("endDate"));

        List<DonationDTO> donations = donationService.getDonationsByUserIdAndDateRange(userId, startDate, endDate);
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/dogs")
    public ResponseEntity<List<DogListDTO>> getDogsByUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        System.out.println("User ID from session: " + userId);
        
        if (userId == null) {
            return ResponseEntity.badRequest().build(); // 사용자 ID가 없으면 400 Bad Request
        }
        // 강아지 정보를 포함한 후원 내역을 가져옵니다.
        List<DogListDTO> dogsWithImages = donationService.getDogsByUserId(userId);
        return ResponseEntity.ok(dogsWithImages);
    }

    @PostMapping("/accounts")
    public ResponseEntity<?> getAccountInfo(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        System.out.println("User ID from session: " + userId);
        if (userId == null) {
            return ResponseEntity.badRequest().build(); // 사용자 ID가 없으면 400 Bad Request
        }

        try {
            List<Map<String, String>> result  = financeService.getAccounts(userId);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            e.printStackTrace(); 
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @PostMapping("/transfer")
    public ResponseEntity<String> handleTransfer(@RequestBody TransferRequestDTO transferRequest, HttpSession session) {
        // Define and initialize apiUrl
        String apiUrl = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/updateDemandDepositAccountTransfer";

        // 세션에서 userId 가져오기
        Long userId = (Long) session.getAttribute("userId");
        System.out.println("User ID from session: " + userId);
        if (userId == null) {
            return ResponseEntity.badRequest().body("User ID not found in session.");
        }

        // Redis에서 userKey 가져오기
        String userKey = redisTemplate.opsForValue().get("userKey:" + userId);
        if (userKey == null) {
            return ResponseEntity.badRequest().body("User key not found in Redis.");
        }

        // User 객체 가져오기
        User user = userService.findById(userId); // userService를 통해 User 객체를 가져옵니다.
        if (user == null) {
            return ResponseEntity.badRequest().body("User not found.");
        }

        // Header 정보 설정
        LocalDateTime now = LocalDateTime.now();
        TransferRequestDTO.Header header = new TransferRequestDTO.Header();
        header.setApiName("updateDemandDepositAccountTransfer");
        header.setTransmissionDate(now.format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        header.setTransmissionTime(now.format(DateTimeFormatter.ofPattern("HHmmss")));
        header.setInstitutionTransactionUniqueNo(generateUniqueTransactionNo(now));
        header.setUserKey(userKey); // userKey 설정

        transferRequest.setHeader(header); // Header 설정

        // 추가 필드 설정
        transferRequest.setDepositTransactionSummary("입금");
        transferRequest.setWithdrawalTransactionSummary("출금");
  
        // HTTP 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<TransferRequestDTO> entity = new HttpEntity<>(transferRequest, headers);

        // 외부 API 호출
        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<TransferResponseDTO> response = restTemplate.postForEntity(apiUrl, entity, TransferResponseDTO.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                TransferResponseDTO transferResponse = response.getBody();
                if (transferResponse != null && transferResponse.getHeader() != null && "H0000".equals(transferResponse.getHeader().getResponseCode())) {
                    // Donation 객체 생성 및 설정
                    Donation donation = new Donation();
                    donation.setTransactionUniqueNo(transferResponse.getHeader().getInstitutionTransactionUniqueNo());
                    donation.setDonationAmount(Integer.parseInt(transferRequest.getTransactionBalance()));
                    donation.setWithdrawalAccount(transferRequest.getWithdrawalAccountNo());
                    donation.setDonationDate(LocalDate.now());
                    
                    // 추가 필드 설정
                    donation.setCheeringMessage(transferRequest.getCheeringMessage());
                    donation.setDepositorName(transferRequest.getDepositorName());
                    donation.setDonationType(transferRequest.getDonationType());
                    donation.setUser(user); // user 필드 설정

                    // Dog와 Shelter 객체 설정
                    if (transferRequest.getDogId() != null) {
                        Dog dog = dogService.findById(transferRequest.getDogId());
                        donation.setDog(dog);
                    } else {
                        donation.setDog(null);
                    }
                    Shelter shelter = shelterService.findById(transferRequest.getShelterId());
                    donation.setShelter(shelter);

                    // Donation 저장
                    donationService.saveDonation(donation);
                    
                    return ResponseEntity.ok("Donation recorded successfully.");
                } else {
                    return ResponseEntity.badRequest().body("Invalid response from external API.");
                }
            } else {
                return ResponseEntity.badRequest().body("Failed to process transfer: " + response.getStatusCode());
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to process transfer: " + e.getMessage());
        }
    }

    // 랜덤 숫자 생성 메서드
    private String generateUniqueTransactionNo(LocalDateTime now) {
        String transmissionDate = now.format(DateTimeFormatter.ofPattern("yyyyMMdd")); // 8자리
        String transmissionTime = now.format(DateTimeFormatter.ofPattern("HHmmss")); // 6자리
        Random random = new Random();
        
        // 6자리 랜덤 숫자 생성
        String randomNumber = String.format("%06d", random.nextInt(1000000)); // 6자리 랜덤 숫자

        // 20자리 문자열 생성
        return transmissionDate + transmissionTime + randomNumber; // 총 20자리
    }

    // 특정 강아지의 후원 내역 조회
    @GetMapping("/dogs/{dogId}")
    public ResponseEntity<List<DonationDTO>> getDonationsByDogId(@PathVariable Long dogId) {
        List<DonationDTO> donations = donationService.getDonationsByDogId(dogId);
        return ResponseEntity.ok(donations);
    }

    // 유저가 후원한 단체의 이름 목록 조회
    @GetMapping("/shelters")
    public ResponseEntity<List<Map<String, String>>> getShelterNames(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        System.out.println("User ID from session: " + userId);
        
        if (userId == null) {
            return ResponseEntity.badRequest().build(); // 사용자 ID가 없으면 400 Bad Request
        }

        List<Map<String, String>> shelterNamesWithFileUrl = donationService.getShelterNamesWithFileUrlByUserId(userId);
        return ResponseEntity.ok(shelterNamesWithFileUrl);
    }

    @GetMapping("/total-amount")
    public ResponseEntity<Map<String, Object>> getTotalDonationAmount(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId"); 
        System.out.println("User ID from session: " + userId);
        
        if (userId == null) {
            return ResponseEntity.badRequest().body(null); // 사용자 ID가 없으면 null 반환
        }

        // 총 후원 금액 계산
        Integer totalAmount = donationService.getTotalDonationAmountByUserId(userId);

        // Redis에서 nickname 가져오기
        String userKey = "user:" + userId;
        String userJson = redisTemplate.opsForValue().get(userKey);
        String nickname = null;

        if (userJson != null) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, Object> userMap = objectMapper.readValue(userJson, Map.class);
                nickname = (String) userMap.get("nickname");
            } catch (Exception e) {
                e.printStackTrace(); // 예외 처리
            }
        }

        // 기본값 설정
        if (nickname == null) {
            nickname = "익명"; // nickname이 없을 경우 기본값 설정
        }
        if (totalAmount == null) {
            totalAmount = 0; // 총 금액이 없을 경우 기본값 설정
        }

        // 응답 객체 생성
        Map<String, Object> response = Map.of(
            "totalAmount", totalAmount,
            "nickname", nickname
        );

        return ResponseEntity.ok(response); // 총 후원 금액과 nickname 반환
    }

    @PostMapping("/shelter-total")
    public ResponseEntity<List<DonationDTO>> getDonationsByShelterId(@RequestBody Map<String, Long> request) {
        Long shelterId = request.get("shelterId");
        if (shelterId == null) {
            return ResponseEntity.badRequest().build();
        }

        List<DonationDTO> donations = donationService.getDonationsByShelterId(shelterId);
        return ResponseEntity.ok(donations);
    }

    @PostMapping("/shelter/total-amount")
    public ResponseEntity<Map<String, Integer>> getTotalDonationAmountByShelterId(@RequestBody Map<String, Long> request) {
        Long shelterId = request.get("shelterId");
        if (shelterId == null) {
            return ResponseEntity.badRequest().build();
        }

        Integer totalAmount = donationService.getTotalDonationAmountByShelterId(shelterId);
        Map<String, Integer> response = Map.of("totalAmount", totalAmount);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/weekly-sums")
    public ResponseEntity<Map<String, Integer>> getWeeklyDonationSumsAndPrediction(@RequestBody Long shelterId) {
        Map<String, Integer> weeklySums = donationService.getWeeklyDonationSumsAndPrediction(shelterId);
        return ResponseEntity.ok(weeklySums);
    }
}