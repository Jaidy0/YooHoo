package com.yoohoo.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class FinanceService {

    private final RedisTemplate<String, String> redisTemplate;
    private final RestTemplate restTemplate;

    @Value("${ssafy.api.key}")
    private String apiKey;

    private static final String ACCOUNT_API_URL =
            "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/inquireDemandDepositAccountList";

    public List<Map<String, String>> getAccounts(Long userId) {
        String userKeyKey = "userKey:" + userId;

        // Redis에서 userKey 가져오기
        String userKey = redisTemplate.opsForValue().get(userKeyKey);
        if (userKey == null) {
            throw new RuntimeException("userKey가 Redis에 존재하지 않습니다.");
        }
         // 계좌 API 요청
    Map<String, Object> header = buildHeader("inquireDemandDepositAccountList", userKey);
    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(Map.of("Header", header), jsonHeaders());

    ResponseEntity<Map> response = restTemplate.exchange(ACCOUNT_API_URL, HttpMethod.POST, entity, Map.class);
    Map<String, Object> body = response.getBody();

    if (body == null || !body.containsKey("REC")) {
        throw new RuntimeException("계좌 정보가 없습니다.");
    }

    List<Map<String, Object>> recList = (List<Map<String, Object>>) body.get("REC");
    if (recList.isEmpty()) {
        throw new RuntimeException("계좌 REC 목록이 비어있습니다.");
    }
        // 계좌 목록 생성
        List<Map<String, String>> accountList = new ArrayList<>();

        for (Map<String, Object> rec : recList) {
            String bankName = (String) rec.get("bankName");
            String accountNo = (String) rec.get("accountNo");
            String accountBalance = (String) rec.get("accountBalance");
    
            if (accountNo == null || accountBalance == null) continue;
    
            accountList.add(Map.of(
                "bankName", bankName,
                "accountNo", accountNo,
                "accountBalance", accountBalance
            ));
        }
    
        if (accountList.isEmpty()) {
            throw new RuntimeException("유효한 계좌 정보가 없습니다.");
        }
    
        // Redis 저장 (JSON 형태로 통째로)
        String redisKey = "userFinInfo:" + userId;
        ObjectMapper objectMapper = new ObjectMapper();
    
        try {
            String jsonValue = objectMapper.writeValueAsString(accountList);
            redisTemplate.opsForValue().set(redisKey, jsonValue);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Redis에 계좌 정보를 저장하는 중 오류 발생", e);
        }
    
        return accountList;
    }


    private Map<String, Object> buildHeader(String apiName, String userKey) {
        LocalDateTime now = LocalDateTime.now();

        return Map.of(
                "apiName", apiName,
                "transmissionDate", now.format(DateTimeFormatter.ofPattern("yyyyMMdd")),
                "transmissionTime", now.format(DateTimeFormatter.ofPattern("HHmmss")),
                "institutionCode", "00100",
                "fintechAppNo", "001",
                "apiServiceCode", apiName,
                "institutionTransactionUniqueNo", generateUniqueTransactionNo(now),
                "apiKey", apiKey,
                "userKey", userKey
        );
    }

    private String generateUniqueTransactionNo(LocalDateTime now) {
        String date = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String time = now.format(DateTimeFormatter.ofPattern("HHmmss"));
        String rand = String.format("%06d", new Random().nextInt(1000000));
        return date + time + rand;
    }

    private HttpHeaders jsonHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }
}
