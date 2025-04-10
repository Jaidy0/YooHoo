package com.yoohoo.backend.repository;

import com.yoohoo.backend.dto.ShelterListDTO;
import com.yoohoo.backend.entity.Shelter;

import org.springframework.data.repository.query.Param;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShelterRepository extends JpaRepository<Shelter, Long> {

    @Query("SELECT new com.yoohoo.backend.dto.ShelterListDTO(" +
           "s.shelterId, s.name, s.foundationDate, s.content, COUNT(d), s.reliability) " +
           "FROM Shelter s LEFT JOIN s.dogs d " +
           "GROUP BY s.shelterId, s.name, s.foundationDate, s.content, s.reliability")
    List<ShelterListDTO> findAllWithDogCount();

    // 특정 shelterId의 상세 정보 조회 (강아지 목록 제외)
    Optional<Shelter> findByShelterId(Long shelterId);


    @Modifying
    @Query("UPDATE Shelter s SET s.reliability = :score WHERE s.id = :shelterId")
    void updateReliability(@Param("shelterId") Long shelterId, @Param("score") int score);

    @Query("SELECT s.reliability FROM Shelter s WHERE s.reliability IS NOT NULL")
    List<Integer> findAllReliabilityScores();
}
