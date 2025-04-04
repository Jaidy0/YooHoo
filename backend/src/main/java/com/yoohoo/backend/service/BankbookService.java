package com.yoohoo.backend.service;

import com.yoohoo.backend.dto.BankbookRequestDTO;
import com.yoohoo.backend.dto.BankbookResponseDTO;
import com.yoohoo.backend.dto.InquireTransactionRequest;
import com.yoohoo.backend.dto.InquireTransactionResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import com.yoohoo.backend.repository.WithdrawalRepository;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.MediaType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Service
public class BankbookService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private WithdrawalRepository withdrawalRepository;

    public BankbookResponseDTO inquireTransactionHistory(Long shelterId) {
        String apiUrl = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/inquireTransactionHistoryList";

        // Redis에서 필요한 값 가져오기
        String userKey = redisTemplate.opsForValue().get("shelterUserKey:" + shelterId);
        String accountNo = redisTemplate.opsForValue().get("shelterAccountNo:" + shelterId);

        if (userKey == null || accountNo == null) {
            return null; // 필요한 정보가 없을 경우 null 반환
        }

        // Header 정보 설정
        LocalDateTime now = LocalDateTime.now();
        BankbookRequestDTO.Header header = new BankbookRequestDTO.Header();
        header.setTransmissionDate(now.format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        header.setTransmissionTime(now.format(DateTimeFormatter.ofPattern("HHmmss")));
        header.setInstitutionTransactionUniqueNo(generateUniqueTransactionNo(now));
        header.setUserKey(userKey);

        // 요청 DTO 설정
        BankbookRequestDTO requestDTO = new BankbookRequestDTO();
        requestDTO.setHeader(header);
        requestDTO.setAccountNo(accountNo);
        requestDTO.setStartDate("20250301");
        requestDTO.setEndDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        requestDTO.setTransactionType("D");
        requestDTO.setOrderByType("ASC");

        // HTTP 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<BankbookRequestDTO> entity = new HttpEntity<>(requestDTO, headers);

        // 외부 API 호출
        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<BankbookResponseDTO> response = restTemplate.postForEntity(apiUrl, entity, BankbookResponseDTO.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody(); // 성공적으로 응답을 반환
            } else {
                return null; // 실패 시 null 반환
            }
        } catch (Exception e) {
            return null; // 예외 발생 시 null 반환
        }
    }

    private String generateUniqueTransactionNo(LocalDateTime now) {
        String transmissionDate = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String transmissionTime = now.format(DateTimeFormatter.ofPattern("HHmmss"));
        String uniqueTransactionNo;

        do {
            // 랜덤한 6자리 숫자 생성
            String randomSixDigits = String.format("%06d", new Random().nextInt(1000000));
            uniqueTransactionNo = transmissionDate + transmissionTime + randomSixDigits;
        } while (withdrawalRepository.existsByTransactionUniqueNo(uniqueTransactionNo)); // 중복 확인

        return uniqueTransactionNo; // 고유한 거래 번호 반환
    }

    public InquireTransactionResponse newInquireTransactionHistory(InquireTransactionRequest request) {
        String apiUrl = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/inquireTransactionHistory";

        // Redis에서 필요한 값 가져오기
        Long shelterId = request.getShelterId();
        String userKey = redisTemplate.opsForValue().get("shelterUserKey:" + shelterId);
        String accountNo = redisTemplate.opsForValue().get("shelterAccountNo:" + shelterId);

        if (userKey == null || accountNo == null) {
            return null; // 필요한 정보가 없을 경우 null 반환
        }

        // Header 정보 설정
        LocalDateTime now = LocalDateTime.now();
        BankbookRequestDTO.Header header = new BankbookRequestDTO.Header();
        header.setTransmissionDate(now.format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        header.setTransmissionTime(now.format(DateTimeFormatter.ofPattern("HHmmss")));
        header.setInstitutionTransactionUniqueNo(generateUniqueTransactionNo(now));
        header.setUserKey(userKey);
        header.setApiName("inquireTransactionHistory");
        header.setInstitutionCode("00100");
        header.setFintechAppNo("001");
        header.setApiServiceCode("inquireTransactionHistory");
        header.setApiKey("54cc585638ea49a5b13f7ec7887c7c1b");

        // 요청 DTO 설정
        BankbookRequestDTO requestDTO = new BankbookRequestDTO();
        requestDTO.setHeader(header);
        requestDTO.setAccountNo(accountNo);
        requestDTO.setTransactionUniqueNo(request.getTransactionUniqueNo());

        // HTTP 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<BankbookRequestDTO> entity = new HttpEntity<>(requestDTO, headers);

        // 외부 API 호출
        RestTemplate restTemplate = new RestTemplate();
        try {
            System.out.println("Transaction Unique No: " + request.getTransactionUniqueNo());
            System.out.println("Shelter ID: " + shelterId);
            System.out.println("User Key: " + userKey);
            System.out.println("Account No: " + accountNo);

            ResponseEntity<InquireTransactionResponse> response = restTemplate.postForEntity(apiUrl, entity, InquireTransactionResponse.class);

            // 응답 로그 출력
            System.out.println("Response Status Code: " + response.getStatusCode());
            System.out.println("Response Body: " + response.getBody());

            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody(); // 성공적으로 응답을 반환
            } else {
                return null; // 실패 시 null 반환
            }
        } catch (Exception e) {
            e.printStackTrace(); // 예외 발생 시 스택 트레이스 출력
            return null; // 예외 발생 시 null 반환
        }
    }

}