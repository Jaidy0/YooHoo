package com.yoohoo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class ReliabilityResponseDto {
    private Long shelterId;
    private int reliabilityScore;           // 총점
    private int dogScore;                   // 강아지 비용 점수 (최대 50점)
    private int fileScore;                  // 첨부파일 점수 (최대 30점)
    private int foundationScore;            // 설립 연차 점수 (최대 20점)
}
