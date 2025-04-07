package com.yoohoo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@AllArgsConstructor
public class ReliabilityResponseDto {
    private Long shelterId;
    private int reliabilityScore;
    private double reliabilityPercentage; // 상위 백분위
}