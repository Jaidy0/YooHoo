package com.yoohoo.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.List;

@Data
public class CardResponseDTO {
    @JsonProperty("Header")
    private Header header;
    @JsonProperty("REC")
    private Rec rec;

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
    public static class Rec {
        @JsonProperty("cardIssuerCode")
        private String cardIssuerCode;
        @JsonProperty("cardIssuerName")
        private String cardIssuerName;
        @JsonProperty("cardName")
        private String cardName;
        @JsonProperty("cardNo")
        private String cardNo;
        @JsonProperty("cvc")
        private String cvc;
        @JsonProperty("estimatedBalance")
        private String estimatedBalance;
        @JsonProperty("transactionList")
        private List<Transaction> transactionList;
    }

    @Data
    public static class Transaction {
        @JsonProperty("transactionUniqueNo")
        private String transactionUniqueNo;
        @JsonProperty("categoryId")
        private String categoryId;
        @JsonProperty("categoryName")
        private String categoryName;
        @JsonProperty("merchantId")
        private String merchantId;
        @JsonProperty("merchantName")
        private String merchantName;
        @JsonProperty("transactionDate")
        private String transactionDate;
        @JsonProperty("transactionTime")
        private String transactionTime;
        @JsonProperty("transactionBalance")
        private String transactionBalance;
        @JsonProperty("cardStatus")
        private String cardStatus;
        @JsonProperty("billStatementsYn")
        private String billStatementsYn;
        @JsonProperty("billStatementsStatus")
        private String billStatementsStatus;
    }
}