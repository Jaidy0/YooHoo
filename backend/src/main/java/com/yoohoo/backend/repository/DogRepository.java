package com.yoohoo.backend.repository;

import com.yoohoo.backend.entity.Dog;

import io.lettuce.core.dynamic.annotation.Param;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DogRepository extends JpaRepository<Dog, Long> {
    // 특정 보호소(shelterId)에 속한 모든 강아지 조회
    List<Dog> findByShelter_ShelterId(Long shelterId);

    @Query("SELECT d FROM Dog d WHERE d.shelter.shelterId = :shelterId AND d.status = :status")
    List<Dog> findDogsByShelterIdAndStatus(Long shelterId, int status);

    @Query("SELECT d.status FROM Dog d WHERE d.shelter.id = :shelterId")
    List<Integer> findStatusesByShelterId(@Param("shelterId") Long shelterId);

}