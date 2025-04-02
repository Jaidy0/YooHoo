package com.yoohoo.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class InquireTransactionRequest {
    @JsonProperty("Header")
    private Header header;
    private String accountNo;
    private String transactionUniqueNo;
    private Long shelterId;

    @Data
    public static class Header {
        @JsonProperty("apiName")
        private String apiName = "inquireTransactionHistory";
        @JsonProperty("transmissionDate")
        private String transmissionDate;
        @JsonProperty("transmissionTime")
        private String transmissionTime;
        @JsonProperty("institutionCode")
        private String institutionCode = "00100";
        @JsonProperty("fintechAppNo")
        private String fintechAppNo = "001";
        @JsonProperty("apiServiceCode")
        private String apiServiceCode = "inquireTransactionHistory";
        @JsonProperty("institutionTransactionUniqueNo")
        private String institutionTransactionUniqueNo;
        @JsonProperty("apiKey")
        private String apiKey = "54cc585638ea49a5b13f7ec7887c7c1b";
        @JsonProperty("userKey")
        private String userKey;
    }
}