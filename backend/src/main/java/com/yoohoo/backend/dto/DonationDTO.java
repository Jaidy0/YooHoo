package com.yoohoo.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class DonationDTO {
    private Long donationId;
    private Integer donationAmount;
    private String transactionUniqueNo;
    private LocalDate donationDate;
    private String depositorName;
    private String cheeringMessage;
    private String userNickname;
    private String dogName;
    private String shelterName;
}