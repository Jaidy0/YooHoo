package com.yoohoo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DogIdNameDTO {
    private Long dogId;
    private String name;
}