package com.yoohoo.backend.service;

import com.yoohoo.backend.entity.Shelter;
import com.yoohoo.backend.repository.ShelterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ShelterFinanceService {

    private final RedisTemplate<String, String> redisTemplate;
    private final RestTemplate restTemplate;
    private final ShelterRepository shelterRepository;

    @Value("${ssafy.api.key}")
    private String apiKey;

    private static final Duration TTL = Duration.ofHours(1);

    private static final String MEMBER_API_URL = "https://finopenapi.ssafy.io/ssafy/api/v1/member/search";
    private static final String ACCOUNT_API_URL = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/inquireDemandDepositAccountList";
    private static final String CARD_API_URL = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/creditCard/inquireSignUpCreditCardList";


    private String getOrFetchUserKey(Long shelterId) {
        String redisKey = "shelterUserKey:" + shelterId;
        String userKey = redisTemplate.opsForValue().get(redisKey);

        if (userKey != null) return userKey;

        Shelter shelter = shelterRepository.findById(shelterId)
                .orElseThrow(() -> new RuntimeException("해당 shelter가 존재하지 않습니다."));
        String email = shelter.getEmail();

        Map<String, String> requestBody = Map.of(
                "apiKey", apiKey,
                "userId", email
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                MEMBER_API_URL,
                HttpMethod.POST,
                entity,
                Map.class
        );

        userKey = (String) response.getBody().get("userKey");
        if (userKey == null) throw new RuntimeException("userKey 조회 실패");

        redisTemplate.opsForValue().set(redisKey, userKey, TTL);
        return userKey;
    }

    // 06-01: 계좌 조회 및 Redis 저장
    public Map<String, String> getAccountAndUserKey(Long shelterId) {
        String userKeyKey = "shelterUserKey:" + shelterId;
        String accountKey = "shelterAccountNo:" + shelterId;

        String userKey = getOrFetchUserKey(shelterId);
        setRedis(userKeyKey, userKey);

        String existingAccount = redisTemplate.opsForValue().get(accountKey);
        String accountNo;

        if (existingAccount != null) {
            accountNo = existingAccount;
        } else {
            Map<String, Object> header = buildHeader("inquireDemandDepositAccountList", userKey);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(Map.of("Header", header), jsonHeaders());

            ResponseEntity<Map> response = restTemplate.exchange(ACCOUNT_API_URL, HttpMethod.POST, entity, Map.class);
            Map<String, Object> body = response.getBody();

            if (body == null || !body.containsKey("REC")) {
                throw new RuntimeException("계좌 정보가 없습니다.");
            }

            List<Map<String, Object>> recList = (List<Map<String, Object>>) body.get("REC");
            if (recList.isEmpty()) throw new RuntimeException("계좌 REC 목록이 비어있습니다.");

            accountNo = (String) recList.get(0).get("accountNo");
            setRedis(accountKey, accountNo);
        }

        Map<String, String> result = new HashMap<>();
        result.put("shelterUserKey:" + shelterId, userKey);
        result.put("shelterAccountNo:" + shelterId, accountNo);
        return result;
    }

    private Map<String, String> fetchCardInfo(String userKey, Long shelterId) {
        String cardKey = "shelterCardNo:" + shelterId;
        String cvcKey = "shelterCvc:" + shelterId;

        Map<String, Object> header = buildHeader("inquireSignUpCreditCardList", userKey);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(Map.of("Header", header), jsonHeaders());

        ResponseEntity<Map> response = restTemplate.exchange(CARD_API_URL, HttpMethod.POST, entity, Map.class);
        Map<String, Object> body = response.getBody();

        if (body == null || !body.containsKey("REC")) {
            throw new RuntimeException("카드 정보가 없습니다.");
        }

        List<Map<String, Object>> recList = (List<Map<String, Object>>) body.get("REC");
        if (recList == null || recList.isEmpty()) {
            throw new RuntimeException("카드 REC 목록이 없습니다.");
        }

        String cardNo = (String) recList.get(0).get("cardNo");
        String cvc = (String) recList.get(0).get("cvc");

        if (cardNo == null || cvc == null) {
            throw new RuntimeException("카드 번호 또는 CVC가 누락되었습니다.");
        }

        setRedis(cardKey, cardNo);
        setRedis(cvcKey, cvc);

        Map<String, String> result = new HashMap<>();
        result.put("shelterCardNo:" + shelterId, cardNo);
        result.put("shelterCvc:" + shelterId, cvc);
        return result;
    }

    private void setRedis(String key, String value) {
        redisTemplate.opsForValue().set(key, value, TTL);
    }

    private HttpHeaders jsonHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }
    
    public Map<String, String> getAccountAndCardFromRedis(Long shelterId) {
        Map<String, String> result = new HashMap<>(getAccountAndUserKey(shelterId));
        Map<String, String> cardInfo = fetchCardInfo(result.get("shelterUserKey:" + shelterId), shelterId);
        result.putAll(cardInfo);
        return result;
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

    public String generateUniqueTransactionNo(LocalDateTime now) {
        String date = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String time = now.format(DateTimeFormatter.ofPattern("HHmmss"));
        String rand = String.format("%06d", new Random().nextInt(1000000));
        return date + time + rand;
    }
}

