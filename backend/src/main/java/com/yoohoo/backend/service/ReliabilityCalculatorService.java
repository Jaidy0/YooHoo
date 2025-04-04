package com.yoohoo.backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Period;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.yoohoo.backend.entity.Shelter;
import com.yoohoo.backend.repository.ShelterRepository;
import com.yoohoo.backend.repository.WithdrawalRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReliabilityCalculatorService {

    private final WithdrawalRepository withdrawalRepository;
    private final ShelterRepository shelterRepository;

    @Transactional
    public void updateShelterReliability(Long shelterId) {
    /**
     * 보호소 신뢰도 점수 계산 로직
     *
     * 총점: 100점 만점
     * - 1. 강아지 비용 비율 (최대 50점)
     *    - dogScore = (dogCost / totalCost) * 50
     *    - 소수점 2자리까지 반올림한 후 곱셈, int로 변환 (소수점 버림)
     *
     * - 2. 영수증 첨부파일 비율 (최대 30점)
     *    - fileScore = round(withFile / total * 30)
     *    - 첨부된 출금건 비율을 기준으로 30점 만점 환산, 반올림 처리
     *
     * - 3. 설립 연차 점수 (최대 20점)
     *    - foundationScore = min(years * 2, 20)
     *    - 연차 1년당 2점, 최대 20점까지 부여 (10년 이상은 20점 고정)
     *
     * - 최종 점수 = dogScore + fileScore + foundationScore
     */
        // 1. 비용 비율 계산
        Map<String, BigDecimal> costMap = withdrawalRepository.sumCostsByShelterId(shelterId);
        BigDecimal dogCost = costMap.getOrDefault("dog_cost", BigDecimal.ZERO);
        BigDecimal totalCost = costMap.getOrDefault("total_cost", BigDecimal.ZERO);
        int dogScore = (totalCost.compareTo(BigDecimal.ZERO) > 0)
            ? dogCost.divide(totalCost, 2, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(50)).intValue()
            : 0;
    
        // 2. 첨부파일 비율 계산
        Map<String, Long> fileMap = withdrawalRepository.countFilesByShelterId(shelterId);
        long withFile = fileMap.getOrDefault("with_file", 0L);
        long total = fileMap.getOrDefault("total", 0L);
        int fileScore = (total > 0)
            ? (int) Math.round((double) withFile / total * 30)
            : 0;
    
        // 3. 설립 연차
        Shelter shelter = shelterRepository.findById(shelterId).orElseThrow();
        int years = LocalDate.now().getYear() - shelter.getFoundationDate().getYear(); // 설립 연차
        int foundationScore = Math.min(years * 2, 20);
    
        int finalScore = dogScore + fileScore + foundationScore;
        shelterRepository.updateReliability(shelterId, finalScore);
    }
    
}
