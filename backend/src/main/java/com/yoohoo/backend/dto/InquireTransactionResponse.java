package com.yoohoo.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class InquireTransactionResponse {
    @JsonProperty("Header")
    private Header header;
    
    @JsonProperty("REC")
    private REC rec;

    @Data
    public static class Header {
        @JsonProperty("responseCode")
        private String responseCode;
        @JsonProperty("responseMessage")
        private String responseMessage;
        @JsonProperty("apiName")
        private String apiName;
        @JsonProperty("transmissionDate")
        private String transmissionDate;
        @JsonProperty("transmissionTime")
        private String transmissionTime;
        @JsonProperty("institutionCode")
        private String institutionCode;
        @JsonProperty("apiKey")
        private String apiKey;
        @JsonProperty("apiServiceCode")
        private String apiServiceCode;
        @JsonProperty("institutionTransactionUniqueNo")
        private String institutionTransactionUniqueNo;
    }

    @Data
    public static class REC {
        @JsonProperty("transactionUniqueNo")
        private String transactionUniqueNo;
        @JsonProperty("transactionDate")
        private String transactionDate;
        @JsonProperty("transactionTime")
        private String transactionTime;
        @JsonProperty("transactionType")
        private String transactionType;
        @JsonProperty("transactionTypeName")
        private String transactionTypeName;
        @JsonProperty("transactionAccountNo")
        private String transactionAccountNo;
        @JsonProperty("transactionBalance")
        private String transactionBalance;
        @JsonProperty("transactionAfterBalance")
        private String transactionAfterBalance;
        @JsonProperty("transactionSummary")
        private String transactionSummary;
        @JsonProperty("transactionMemo")
        private String transactionMemo;
    }
}