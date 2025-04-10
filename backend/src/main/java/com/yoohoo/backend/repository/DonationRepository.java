package com.yoohoo.backend.repository;

import com.yoohoo.backend.entity.Dog;
import com.yoohoo.backend.entity.Donation;

import io.lettuce.core.dynamic.annotation.Param;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    // 특정 사용자의 후원 내역 조회
    List<Donation> findByUser_UserId(Long userId);

    // 특정 사용자의 후원 내역을 날짜 범위로 조회
    List<Donation> findByUser_UserIdAndDonationDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

    // 특정 강아지의 후원 내역을 조회회
    List<Donation> findByDog_DogId(Long dogId);

    // 특정 단체의 기부 내역 조회
    List<Donation> findByShelter_ShelterId(Long shelterId);

    // 특정 날짜 범위의 기부 내역 조회
    List<Donation> findByDonationDateBetween(LocalDate startDate, LocalDate endDate);


    @Query("SELECT d.dog FROM Donation d WHERE d.user.userId = :userId")
    List<Dog> findDogsByUserId(@Param("userId") Long userId);

    List<Donation> findByShelter_ShelterIdAndDonationDateBetween(Long shelterId, LocalDate startDate, LocalDate endDate);
    
}