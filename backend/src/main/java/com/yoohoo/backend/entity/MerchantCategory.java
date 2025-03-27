package com.yoohoo.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class MerchantCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long merchantCategoryId;

    @Column(nullable = false, length = 255)
    private String categoryId;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String industry;

    @Column(length = 30, nullable = false)
    private String businessNumber;

    @Column(length = 30, nullable = false)
    private String phone;

    @Column(length = 30, nullable = false)
    private String address;

    @Column(nullable = false)
    private Long merchantId;

    @Column(length = 30, nullable = false)
    private String merchantName;

    // Getters and Setters
    // ...
}