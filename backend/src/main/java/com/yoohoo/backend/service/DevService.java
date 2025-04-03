package com.yoohoo.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.yoohoo.backend.dto.BankbookRequestDTO;
import com.yoohoo.backend.dto.BankbookResponseDTO;
import com.yoohoo.backend.dto.CardResponseDTO;
import com.yoohoo.backend.dto.CardRequestDTO;
import com.yoohoo.backend.dto.ShelterRequest;

@Service
public class DevService {

    public BankbookResponseDTO bankinquireTransactionHistory(ShelterRequest request) {
        String apiUrl = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/inquireTransactionHistoryList";

        String userKey = request.getUserKey();
        String accountNo = request.getAccountNo();

        if (userKey == null || accountNo == null) {
            return null;
        }

        LocalDateTime now = LocalDateTime.now();

        BankbookRequestDTO.Header header = new BankbookRequestDTO.Header();
        header.setApiName("inquireTransactionHistoryList");
        header.setTransmissionDate(now.format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        header.setTransmissionTime(now.format(DateTimeFormatter.ofPattern("HHmmss")));
        header.setInstitutionTransactionUniqueNo(generateUniqueTransactionNo(now));
        header.setInstitutionCode("00100");
        header.setFintechAppNo("001");
        header.setApiKey("54cc585638ea49a5b13f7ec7887c7c1b");
        header.setApiServiceCode("inquireTransactionHistoryList");
        header.setUserKey(userKey);

        BankbookRequestDTO requestDTO = new BankbookRequestDTO();
        requestDTO.setHeader(header);
        requestDTO.setAccountNo(accountNo);
        requestDTO.setStartDate("20250301");
        requestDTO.setEndDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        requestDTO.setTransactionType("A");
        requestDTO.setOrderByType("ASC");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<BankbookRequestDTO> entity = new HttpEntity<>(requestDTO, headers);

        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<BankbookResponseDTO> response =
                restTemplate.postForEntity(apiUrl, entity, BankbookResponseDTO.class);
            return response.getStatusCode().is2xxSuccessful() ? response.getBody() : null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public CardResponseDTO cardinquireCreditCardTransactions(ShelterRequest request) {
        String apiUrl = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/creditCard/inquireCreditCardTransactionList";

        String cardNo = request.getCardNo();
        String cvc = request.getCvc();
        String userKey = request.getUserKey();

        if (cardNo == null || cvc == null || userKey == null) {
            return null;
        }

        LocalDateTime now = LocalDateTime.now();

        CardRequestDTO.Header header = new CardRequestDTO.Header();
        header.setApiName("inquireCreditCardTransactionList");
        header.setTransmissionDate(now.format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        header.setTransmissionTime(now.format(DateTimeFormatter.ofPattern("HHmmss")));
        header.setInstitutionTransactionUniqueNo(generateUniqueTransactionNo(now));
        header.setInstitutionCode("00100");
        header.setFintechAppNo("001");
        header.setApiServiceCode("inquireCreditCardTransactionList");
        header.setApiKey("54cc585638ea49a5b13f7ec7887c7c1b");
        header.setUserKey(userKey);

        CardRequestDTO requestDTO = new CardRequestDTO();
        requestDTO.setHeader(header);
        requestDTO.setCardNo(cardNo);
        requestDTO.setCvc(cvc);
        requestDTO.setStartDate("20250101");
        requestDTO.setEndDate(LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<CardRequestDTO> entity = new HttpEntity<>(requestDTO, headers);

        RestTemplate restTemplate = new RestTemplate();
        try {
            ResponseEntity<CardResponseDTO> response =
                restTemplate.postForEntity(apiUrl, entity, CardResponseDTO.class);
            return response.getStatusCode().is2xxSuccessful() ? response.getBody() : null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private String generateUniqueTransactionNo(LocalDateTime now) {
        return now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS")) + (int) (Math.random() * 1000);
    }
}
