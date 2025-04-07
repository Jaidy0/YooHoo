package com.yoohoo.backend.service;

import com.yoohoo.backend.dto.ReliabilityResponseDto;
import com.yoohoo.backend.dto.ShelterDetailDTO;
import com.yoohoo.backend.dto.ShelterListDTO;
import com.yoohoo.backend.entity.Shelter;
import com.yoohoo.backend.repository.ShelterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ShelterService {

    private final ShelterRepository shelterRepository;
    private final S3Service s3Service;

    @Autowired
    public ShelterService(ShelterRepository shelterRepository, S3Service s3Service) {
        this.shelterRepository = shelterRepository;
        this.s3Service = s3Service;
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

    public ReliabilityResponseDto getReliability(Long shelterId) {
        Shelter target = shelterRepository.findById(shelterId)
                .orElseThrow(() -> new IllegalArgumentException("해당 보호소를 찾을 수 없습니다."));
    
        Integer score = target.getReliability();
        if (score == null) score = 0;
    
        final int finalScore = score;
    
        List<Integer> allScores = shelterRepository.findAllReliabilityScores();
        if (allScores.isEmpty()) return new ReliabilityResponseDto(shelterId, 0, 0.0);
    
        long total = allScores.size();
        long lowerCount = allScores.stream()
                .filter(s -> s != null && s < finalScore)
                .count();
    
        double percentile = ((double) lowerCount / total) * 100.0;
    
        return new ReliabilityResponseDto(shelterId, score, Math.round(percentile * 10) / 10.0); // 소수점 1자리
    }
    
}
