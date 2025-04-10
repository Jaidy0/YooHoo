package com.yoohoo.backend.dto;

public interface WithdrawalProjectionDTO {
    Long getWithdrawalId();
    String getCategory();
    String getTransactionBalance();
    String getDate();
    Long getMerchantId();
    Long getShelterId();
    String getTransactionUniqueNo();
    Long getDogId();
    Long getFileId(); 
}
