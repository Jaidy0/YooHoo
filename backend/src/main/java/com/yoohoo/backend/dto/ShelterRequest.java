package com.yoohoo.backend.dto;

public class ShelterRequest {
    private Long shelterId;
    private String userKey;
    private String accountNo;
    private String cardNo;
    private String cvc;

    public ShelterRequest() {}

    public ShelterRequest(Long shelterId, String userKey, String accountNo, String cardNo, String cvc) {
        this.shelterId = shelterId;
        this.userKey = userKey;
        this.accountNo = accountNo;
        this.cardNo = cardNo;
        this.cvc = cvc;
    }

    public Long getShelterId() { return shelterId; }
    public void setShelterId(Long shelterId) { this.shelterId = shelterId; }

    public String getUserKey() { return userKey; }
    public void setUserKey(String userKey) { this.userKey = userKey; }

    public String getAccountNo() { return accountNo; }
    public void setAccountNo(String accountNo) { this.accountNo = accountNo; }

    public String getCardNo() { return cardNo; }
    public void setCardNo(String cardNo) { this.cardNo = cardNo; }

    public String getCvc() { return cvc; }
    public void setCvc(String cvc) { this.cvc = cvc; }
}
