package com.yoohoo.backend.repository;

import com.yoohoo.backend.entity.Withdrawal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDate;

@Repository
public interface WithdrawalRepository extends JpaRepository<Withdrawal, Long> {
    boolean existsByTransactionUniqueNo(String transactionUniqueNo);

    // Add method to find withdrawals by dogId
    List<Withdrawal> findByDogId(Long dogId);

    // 특정 단체의 지출 내역 조회
    List<Withdrawal> findByShelterId(Long shelterId);

    // 특정 날짜 범위의 지출 내역 조회
    @Query("SELECT w FROM Withdrawal w WHERE w.date BETWEEN :startDate AND :endDate")
    List<Withdrawal> findByDateBetween(@Param("startDate") String startDate, @Param("endDate") String endDate);
}