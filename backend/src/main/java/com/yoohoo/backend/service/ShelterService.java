package com.yoohoo.backend.service;

import com.yoohoo.backend.dto.ReliabilityResponseDto;
import com.yoohoo.backend.dto.ShelterDetailDTO;
import com.yoohoo.backend.dto.ShelterListDTO;
import com.yoohoo.backend.entity.Shelter;
import com.yoohoo.backend.repository.ShelterRepository;
import com.yoohoo.backend.repository.WithdrawalRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ShelterService {

    private final ShelterRepository shelterRepository;
    private final S3Service s3Service;
    private final WithdrawalRepository withdrawalRepository;

    @Autowired
    public ShelterService(ShelterRepository shelterRepository, S3Service s3Service, WithdrawalRepository withdrawalRepository) {
        this.shelterRepository = shelterRepository;
        this.s3Service = s3Service;
        this.withdrawalRepository = withdrawalRepository;
    }

    // 강아지 수 + 이미지 포함된 DTO 반환

    public List<ShelterListDTO> getAllShelters() {
        List<ShelterListDTO> list = shelterRepository.findAllWithDogCount();

        // N+1 방지: shelterId 목록 추출 후 한 번에 이미지 URL 조회
        List<Long> shelterIds = list.stream()
                .map(ShelterListDTO::getShelterId)
                .collect(Collectors.toList());

        Map<Long, String> imageUrlMap = s3Service.getFileUrlsByEntityTypeAndEntityIds(0, shelterIds);

        list.forEach(shelter ->
                shelter.setImageUrl(imageUrlMap.getOrDefault(shelter.getShelterId(), null)));

        return list;
    }

    
    // 특정 단체 상세 조회 (강아지 목록 제외)
    public ShelterDetailDTO getShelterById(Long shelterId) {
        Shelter shelter = shelterRepository.findByShelterId(shelterId)
                .orElseThrow(() -> new RuntimeException("Shelter not found with id: " + shelterId));
        String imageUrl = s3Service.getFileUrlByEntityTypeAndEntityId(0, shelterId);

        return new ShelterDetailDTO(
                shelter.getShelterId(),
                shelter.getName(),
                shelter.getAddress(),
                shelter.getFoundationDate(),
                shelter.getContent(),
                shelter.getEmail(),
                shelter.getPhone(),
                shelter.getBusinessNumber(),
                shelter.getReliability(),
                imageUrl
                        );
    }

    public Shelter findById(Long shelterId) {
        Optional<Shelter> shelter = shelterRepository.findById(shelterId);
        return shelter.orElse(null); // 보호소가 없으면 null 반환
    }

@Transactional
public ReliabilityResponseDto getReliability(Long shelterId) {
    Shelter shelter = shelterRepository.findById(shelterId)
            .orElseThrow(() -> new IllegalArgumentException("해당 보호소를 찾을 수 없습니다."));

    // 1. 강아지 비용 점수 계산
    Map<String, BigDecimal> costMap = withdrawalRepository.sumCostsByShelterId(shelterId);
    BigDecimal dogCost = costMap.getOrDefault("dog_cost", BigDecimal.ZERO);
    BigDecimal totalCost = costMap.getOrDefault("total_cost", BigDecimal.ZERO);
    int dogScore = (totalCost.compareTo(BigDecimal.ZERO) > 0)
        ? dogCost.divide(totalCost, 2, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(50)).intValue()
        : 0;

    // 2. 첨부파일 점수 계산
    Map<String, Long> fileMap = withdrawalRepository.countFilesByShelterId(shelterId);
    long withFile = fileMap.getOrDefault("with_file", 0L);
    long total = fileMap.getOrDefault("total", 0L);
    int fileScore = (total > 0)
        ? (int) Math.round((double) withFile / total * 30)
        : 0;

    // 3. 설립 연차 점수 계산
    int years = LocalDate.now().getYear() - shelter.getFoundationDate().getYear();
    int foundationScore = Math.min(years * 2, 20);

    // 최종 점수 계산
    int totalScore = dogScore + fileScore + foundationScore;
    // 저장
    shelterRepository.updateReliability(shelterId, totalScore);

    // 퍼센트 제외 버전
    return new ReliabilityResponseDto(
        shelterId,
        totalScore,
        dogScore,
        fileScore,
        foundationScore
    );
}

    
}
