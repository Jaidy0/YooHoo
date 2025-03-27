package com.yoohoo.backend.service;

import com.yoohoo.backend.dto.CardRequestDTO;
import com.yoohoo.backend.dto.CardResponseDTO;
import com.yoohoo.backend.entity.Withdrawal;
import com.yoohoo.backend.repository.WithdrawalRepository;
import com.yoohoo.backend.repository.MerchantCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import com.yoohoo.backend.entity.MerchantCategory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.MediaType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class CardService {

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private WithdrawalRepository withdrawalRepository;

    @Autowired
    private MerchantCategoryRepository merchantCategoryRepository;

    public CardResponseDTO inquireCreditCardTransactions(Long shelterId) {
        String apiUrl = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/creditCard/inquireCreditCardTransactionList";

        // Redis에서 필요한 값 가져오기
        String userKey = redisTemplate.opsForValue().get("shelterUserKey:" + shelterId);
        String cardNo = redisTemplate.opsForValue().get("shelterCardNo:" + shelterId);
        String cvc = redisTemplate.opsForValue().get("shelterCvc:" + shelterId);

        if (userKey == null || cardNo == null || cvc == null) {
            return null; // 필요한 정보가 없을 경우 null 반환
        }

        // Header 정보 설정
        LocalDateTime now = LocalDateTime.now();
        CardRequestDTO.Header header = new CardRequestDTO.Header();
        header.setApiName("inquireCreditCardTransactionList");
        header.setTransmissionDate(now.format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        header.setTransmissionTime(now.format(DateTimeFormatter.ofPattern("HHmmss")));
        header.setInstitutionCode("00100");
        header.setFintechAppNo("001");
        header.setApiServiceCode("inquireCreditCardTransactionList");
        header.setInstitutionTransactionUniqueNo(generateUniqueTransactionNo(now));
        header.setApiKey("54cc585638ea49a5b13f7ec7887c7c1b");
        header.setUserKey(userKey);

        // 요청 DTO 설정
        CardRequestDTO requestDTO = new CardRequestDTO();
        requestDTO.setHeader(header);
        requestDTO.setCardNo(cardNo);
        requestDTO.setCvc(cvc);
        requestDTO.setStartDate("20250101");
        requestDTO.setEndDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));

        // HTTP 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<CardRequestDTO> entity = new HttpEntity<>(requestDTO, headers);

        // 외부 API 호출
        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<CardResponseDTO> response = restTemplate.postForEntity(apiUrl, entity, CardResponseDTO.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody(); // 성공적으로 응답을 반환
            } else {
                return null; // 실패 시 null 반환
            }
        } catch (Exception e) {
            return null; // 예외 발생 시 null 반환
        }
    }

    public void saveCardTransactions(CardResponseDTO response, Long shelterId) {
        for (CardResponseDTO.Transaction transaction : response.getRec().getTransactionList()) {
            if (!withdrawalRepository.existsByTransactionUniqueNo(transaction.getTransactionUniqueNo())) {
                Withdrawal withdrawal = new Withdrawal();
                withdrawal.setDogId(null);
                withdrawal.setCategory(transaction.getCategoryName());
                withdrawal.setTransactionBalance(transaction.getTransactionBalance());
                withdrawal.setContent(getMerchantCategory(Long.parseLong(transaction.getMerchantId())));
                withdrawal.setDate(transaction.getTransactionDate());
                withdrawal.setMerchantId(Long.parseLong(transaction.getMerchantId()));
                withdrawal.setShelterId(shelterId);
                withdrawal.setTransactionUniqueNo(transaction.getTransactionUniqueNo());

                withdrawalRepository.save(withdrawal);
            }
        }
    }

    private String getMerchantCategory(Long merchantId) {
        MerchantCategory merchantCategory = merchantCategoryRepository.findByMerchantId(merchantId);
        return merchantCategory != null ? merchantCategory.getCategory() : "Unknown";
    }

    private String generateUniqueTransactionNo(LocalDateTime now) {
        String transmissionDate = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String transmissionTime = now.format(DateTimeFormatter.ofPattern("HHmmss"));
        return transmissionDate + transmissionTime + "000001"; // 예시로 고정된 일련번호 사용
    }
}