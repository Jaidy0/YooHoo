package com.yoohoo.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CardRequestDTO {
    @JsonProperty("Header")
    private Header header;
    private String cardNo;
    private String cvc;
    private String startDate;
    private String endDate;

    @Data
    public static class Header {
        @JsonProperty("apiName")
        private String apiName = "inquireCreditCardTransactionList";
        @JsonProperty("transmissionDate")
        private String transmissionDate;
        @JsonProperty("transmissionTime")
        private String transmissionTime;
        @JsonProperty("institutionCode")
        private String institutionCode = "00100";
        @JsonProperty("fintechAppNo")
        private String fintechAppNo = "001";
        @JsonProperty("apiServiceCode")
        private String apiServiceCode = "inquireCreditCardTransactionList";
        @JsonProperty("institutionTransactionUniqueNo")
        private String institutionTransactionUniqueNo;
        @JsonProperty("apiKey")
        private String apiKey = "54cc585638ea49a5b13f7ec7887c7c1b";
        @JsonProperty("userKey")
        private String userKey;
    }
}