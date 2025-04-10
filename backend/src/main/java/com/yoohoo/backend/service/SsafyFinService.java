package com.yoohoo.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class SsafyFinService {

    private final RestTemplate restTemplate = new RestTemplate();

    // ✅ 환경변수 (env에서 주입됨)
    @Value("${SSAFY_API_KEY}")
    private String apiKey;

    // ✅ 직접 상수로 정의
    private static final String MEMBER_URL = "https://finopenapi.ssafy.io/ssafy/api/v1/member";
    private static final String ACCOUNT_URL = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/createDemandDepositAccount";
    private static final String DEPOSIT_URL = "https://finopenapi.ssafy.io/ssafy/api/v1/edu/demandDeposit/updateDemandDepositAccountDeposit";
    private static final String ACCOUNT_TYPE_NO = "999-1-b9744b3c37a243";

    public Map<String, Object> initializeFund(String email) {
        Map<String, Object> result = new HashMap<>();

        // 사용자 등록
        Map<String, Object> memberPayload = Map.of(
                "apiKey", apiKey,
                "userId", email
        );
        ResponseEntity<Map> memberResp = restTemplate.postForEntity(MEMBER_URL, memberPayload, Map.class);
        String userKey = (String) memberResp.getBody().get("userKey");
        if (userKey == null) {
            result.put("message", "❌ 사용자 등록 실패");
            result.put("response", memberResp.getBody());
            return result;
        }

        // 계좌 생성
        Map<String, Object> createHeader = buildHeader("createDemandDepositAccount", userKey);
        Map<String, Object> accountPayload = Map.of(
                "Header", createHeader,
                "accountTypeUniqueNo", ACCOUNT_TYPE_NO
        );
        ResponseEntity<Map> accountResp = restTemplate.postForEntity(ACCOUNT_URL, accountPayload, Map.class);
        String accountNo;
        try {
            Map<String, Object> rec = (Map<String, Object>) accountResp.getBody().get("REC");
            accountNo = (String) rec.get("accountNo");
        } catch (Exception e) {
            result.put("message", "❌ 계좌 생성 실패");
            result.put("response", accountResp.getBody());
            return result;
        }

        // 100만원 입금
        Map<String, Object> depositHeader = buildHeader("updateDemandDepositAccountDeposit", userKey);
        Map<String, Object> depositPayload = Map.of(
                "Header", depositHeader,
                "accountNo", accountNo,
                "transactionBalance", "1000000",
                "transactionSummary", "초기 자금 입금"
        );
        ResponseEntity<Map> depositResp = restTemplate.postForEntity(DEPOSIT_URL, depositPayload, Map.class);
        if (depositResp.getStatusCode() != HttpStatus.OK) {
            result.put("message", "❌ 입금 실패");
            result.put("response", depositResp.getBody());
            return result;
        }

        result.put("message", "✅ 성공적으로 계좌 생성");
        result.put("userKey", userKey);
        result.put("accountNo", accountNo);
        return result;
    }

    private Map<String, Object> buildHeader(String apiServiceCode, String userKey) {
        Date now = new Date();
        SimpleDateFormat sdfDate = new SimpleDateFormat("yyyyMMdd");
        SimpleDateFormat sdfTime = new SimpleDateFormat("HHmmss");
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(now) + new Random().nextInt(900000);

        Map<String, Object> header = new HashMap<>();
        header.put("apiName", apiServiceCode);
        header.put("transmissionDate", sdfDate.format(now));
        header.put("transmissionTime", sdfTime.format(now));
        header.put("institutionCode", "00100");
        header.put("fintechAppNo", "001");
        header.put("apiServiceCode", apiServiceCode);
        header.put("institutionTransactionUniqueNo", timestamp);
        header.put("apiKey", apiKey);
        header.put("userKey", userKey);
        return header;
    }
}
