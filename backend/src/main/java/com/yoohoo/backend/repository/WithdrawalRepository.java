package com.yoohoo.backend.repository;

import com.yoohoo.backend.dto.WithdrawalProjectionDTO;
import com.yoohoo.backend.entity.Withdrawal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;
import java.math.BigDecimal;
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

    // WithdrawalRepository.java
    @Query("""
        SELECT new map(
            SUM(CASE WHEN w.category IN ('물품구매', '의료비') THEN CAST(w.transactionBalance AS bigdecimal) ELSE 0 END) as dog_cost,
            SUM(CAST(w.transactionBalance AS bigdecimal)) as total_cost
        )
        FROM Withdrawal w
        WHERE w.shelterId = :shelterId
    """)
    Map<String, BigDecimal> sumCostsByShelterId(@Param("shelterId") Long shelterId);
    
    @Query("""
        SELECT new map(
            COUNT(w) as total,
            SUM(CASE WHEN w.file IS NOT NULL THEN 1 ELSE 0 END) as with_file
        )
        FROM Withdrawal w
        WHERE w.shelterId = :shelterId
    """)
    Map<String, Long> countFilesByShelterId(@Param("shelterId") Long shelterId);
    
    @Query("SELECT w.withdrawalId AS withdrawalId, " +
    "w.category AS category, " +
    "w.transactionBalance AS transactionBalance, " +
    "w.date AS date, " +
    "w.merchantId AS merchantId, " +
    "w.shelterId AS shelterId, " +
    "w.transactionUniqueNo AS transactionUniqueNo, " +
    "w.dogId AS dogId, " +
    "w.file.fileId AS fileId " +  
    "FROM Withdrawal w WHERE w.shelterId = :shelterId")
List<WithdrawalProjectionDTO> findAllByShelterIdWithProjection(@Param("shelterId") Long shelterId);

@Query("SELECT w FROM Withdrawal w WHERE w.shelterId = :shelterId AND w.date BETWEEN :startDate AND :endDate")
List<Withdrawal> findByShelterIdAndDateBetween(@Param("shelterId") Long shelterId, 
                                                @Param("startDate") String startDate, 
                                                @Param("endDate") String endDate);
}