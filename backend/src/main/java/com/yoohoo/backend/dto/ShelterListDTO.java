package com.yoohoo.backend.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShelterListDTO {
    private Long shelterId;
    private String name;
    private LocalDate foundation_date;
    private String content;
    private Long dogCount;
    private Integer reliability;
    private String imageUrl;

    // ✅ JPQL에서 사용하는 생성자 (foundation_date 포함)
    public ShelterListDTO(Long shelterId, String name, LocalDate foundation_date, String content, Long dogCount, Integer reliability) {
        this.shelterId = shelterId;
        this.name = name;
        this.foundation_date = foundation_date;
        this.content = content;
        this.dogCount = dogCount;
        this.reliability = reliability;
    }
}