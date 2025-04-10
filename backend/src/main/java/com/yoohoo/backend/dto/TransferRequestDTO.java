package com.yoohoo.backend.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class TransferRequestDTO {
    @Data
    public static class Header {
        private String apiName = "updateDemandDepositAccountTransfer";
        private String transmissionDate;
        private String transmissionTime;
        private String institutionCode = "00100";
        private String fintechAppNo = "001";
        private String apiServiceCode = "updateDemandDepositAccountTransfer";
        private String institutionTransactionUniqueNo;
        private String apiKey = "54cc585638ea49a5b13f7ec7887c7c1b";
        private String userKey;
    }


    @JsonProperty("Header")
    private Header Header;

    // 나머지 필드
    private String depositAccountNo;
    private String depositTransactionSummary;
    private String transactionBalance;
    private String withdrawalAccountNo; 
    private String withdrawalTransactionSummary;
    private String cheeringMessage; // 후원 메시지
    private String depositorName; // 후원자 이름
    private Integer donationType; // 후원 유형 (Integer로 변경)
    private Long dogId; // 강아지 ID
    private Long shelterId; // 보호소 ID


    // 기본 생성자 추가
    public TransferRequestDTO() {
        // 초기화 로직이 필요할 경우 추가
    }
}