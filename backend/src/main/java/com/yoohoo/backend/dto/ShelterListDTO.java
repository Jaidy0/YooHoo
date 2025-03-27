package com.yoohoo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShelterListDTO {
    private Long shelterId;
    private String name;
    private String content;
    private Long dogCount;
    private Integer reliability;
    private String imageUrl;

    // JPQL에서 사용하는 생성자
    public ShelterListDTO(Long shelterId, String name, String content, Long dogCount, Integer reliability) {
        this.shelterId = shelterId;
        this.name = name;
        this.content = content;
        this.dogCount = dogCount;
        this.reliability = reliability;
    }
}
