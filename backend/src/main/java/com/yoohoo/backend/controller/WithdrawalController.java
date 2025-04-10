package com.yoohoo.backend.controller;

import com.yoohoo.backend.service.WithdrawalService;
import com.yoohoo.backend.entity.Withdrawal;
import com.yoohoo.backend.service.BankbookService;
import com.yoohoo.backend.service.CardService;
import com.yoohoo.backend.service.S3Service;
import com.yoohoo.backend.service.ShelterService;
import com.yoohoo.backend.repository.WithdrawalRepository;
import com.yoohoo.backend.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.yoohoo.backend.dto.BankbookResponseDTO;
import com.yoohoo.backend.dto.CardResponseDTO;
import com.yoohoo.backend.entity.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import jakarta.servlet.http.HttpSession;
import java.util.LinkedHashMap;

@RestController
@RequestMapping("/api/withdrawal")
public class WithdrawalController {

    @Autowired
    private WithdrawalService withdrawalService;

    @Autowired
    private S3Service s3Service;

    @Autowired
    private RestTemplate RestTemplate;
    
    @Autowired
    private WithdrawalRepository withdrawalRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private ShelterService shelterService;

    @Autowired
    private BankbookService bankbookService;

    @Autowired
    private CardService cardService;


    @Value("${app.domain}")
    private String domain;

    @PutMapping("/{withdrawalId}/dogId")
    public ResponseEntity<Map<String, String>> updateDogId(
            @PathVariable Long withdrawalId,
            @RequestBody DogIdRequest request) {
        Optional<String> dogName = withdrawalService.updateDogId(withdrawalId, request.getNewDogId());
        Map<String, String> response = new HashMap<>();
        if (dogName.isPresent()) {
            response.put("name", dogName.get());
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "Withdrawal not found.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/shelter/{shelterId}/all")
    public ResponseEntity<List<Map<String, Object>>> getAllWithdrawals(@PathVariable Long shelterId) {
        List<Map<String, Object>> result = withdrawalService.getWithdrawalsByShelterId(shelterId);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/sync")
    public ResponseEntity<String> syncAllWithdrawals(@RequestBody ShelterRequest request) {
        Long shelterId = request.getShelterId();

        BankbookResponseDTO bankbookResponse = bankbookService.inquireTransactionHistory(shelterId);
        CardResponseDTO cardResponse = cardService.inquireCreditCardTransactions(shelterId);

        withdrawalService.syncAllWithdrawals(shelterId, bankbookResponse, cardResponse);

        return ResponseEntity.ok("출금 정보 동기화 및 신뢰도 갱신 완료");
    }

    public static class ShelterRequest {
        private Long shelterId;
        public Long getShelterId() { return shelterId; }
        public void setShelterId(Long shelterId) { this.shelterId = shelterId; }
    }


    @GetMapping("/dog/{dogId}")
    public ResponseEntity<List<Map<String, Object>>> getWithdrawalsByDogId(@PathVariable Long dogId) {
        List<Map<String, Object>> withdrawals = withdrawalService.getWithdrawalsByDogId(dogId);
        return ResponseEntity.ok(withdrawals);
    }

    @GetMapping("/{withdrawalId}/fileUrl")
    public ResponseEntity<Map<String, String>> getFileUrlByWithdrawalId(@PathVariable Long withdrawalId) {
        Optional<String> fileUrl = withdrawalService.getFileUrlByWithdrawalId(withdrawalId);
        Map<String, String> response = new HashMap<>();
        if (fileUrl.isPresent()) {
            response.put("fileUrl", fileUrl.get());
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "File not found.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/shelter/total-amount")
    public ResponseEntity<Map<String, Double>> getTotalTransactionBalanceByShelterId(@RequestBody Map<String, Long> request) {
        Long shelterId = request.get("shelterId");
        if (shelterId == null) {
            return ResponseEntity.badRequest().build();
        }

        Double totalBalance = withdrawalService.getTotalTransactionBalanceByShelterId(shelterId);
        Map<String, Double> response = Map.of("totalAmount", totalBalance);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/weekly-sums")
    public ResponseEntity<Map<String, Double>> getWeeklyExpenditureSumsAndPrediction(@RequestBody Map<String, Long> requestBody) {
        Long shelterId = requestBody.get("shelterId"); // 요청 본문에서 shelterId를 가져옴
        Map<String, Integer> weeklySums = withdrawalService.getWeeklyExpenditureSumsAndPrediction(shelterId);

        // Double로 변환하여 반환
        Map<String, Double> result = new LinkedHashMap<>();
        for (Map.Entry<String, Integer> entry : weeklySums.entrySet()) {
            result.put(entry.getKey(), entry.getValue().doubleValue());
        }

        return ResponseEntity.ok(result);
    }

    public static class DogIdRequest {
        private Long newDogId;

        public Long getNewDogId() {
            return newDogId;
        }

        public void setNewDogId(Long newDogId) {
            this.newDogId = newDogId;
        }
    }


    @PostMapping("/{withdrawalId}/imageupload")
    public ResponseEntity<String> uploadwithdrawalImage(
    @PathVariable Long withdrawalId,
    @RequestPart(value = "file", required = false) MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("파일이 없습니다.");
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("file", file.getResource());
            
            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
            
            ResponseEntity<String> response = RestTemplate.exchange(
                domain + "/api/s3/upload",
                HttpMethod.POST,
                requestEntity,
                String.class
                );
                
                if (response.getStatusCode().is2xxSuccessful()) {
                    String fileUrl = response.getBody();
                    File savedFile = s3Service.saveFileEntity(file, 2, withdrawalId, fileUrl);                    
                    // ✅ Withdrawal 업데이트
                    Withdrawal withdrawal = withdrawalRepository.findById(withdrawalId)
                            .orElseThrow(() -> new RuntimeException("해당 withdrawalId를 찾을 수 없습니다."));
                            withdrawal.setFile(savedFile);
                            withdrawalRepository.save(withdrawal);
                            shelterService.getReliability(withdrawal.getShelterId());


            return ResponseEntity.ok("업로드 완료: " + fileUrl);

                } else {
                    return ResponseEntity.status(500).body("S3 업로드 실패: " + response.getStatusCode());
                }
                
            } catch (Exception e) {
                throw new RuntimeException("이미지 업로드 중 예외 발생", e);
            }
    }


    @PostMapping("/category-percentages")
    public ResponseEntity<List<Map<String, Object>>> getCategoryPercentages(@RequestBody Map<String, Long> request) {
        Long shelterId = request.get("shelterId");
        if (shelterId == null) {
            return ResponseEntity.badRequest().body(null);
        }
    
        List<Map<String, Object>> percentages = withdrawalService.getCategoryPercentagesByShelterId(shelterId);
        return ResponseEntity.ok(percentages);
    }

}
