package com.yoohoo.backend.repository;

import com.yoohoo.backend.entity.MerchantCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MerchantCategoryRepository extends JpaRepository<MerchantCategory, Long> {
    Optional<MerchantCategory> findByMerchantName(String merchantName);
    List<MerchantCategory> findByCategoryId(String categoryId);
    MerchantCategory findByMerchantId(Long merchantId);
}