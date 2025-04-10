package com.yoohoo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ShelterDetailDTO {
    private Long shelterId;
    private String name;
    private String address;
    private LocalDate foundationDate;
    private String content;
    private String email;
    private String phone;
    private String businessNumber;
    private Integer reliability;
    private String imageUrl; 

}