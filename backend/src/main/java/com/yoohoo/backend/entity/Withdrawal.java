package com.yoohoo.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Withdrawal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long withdrawalId;

    @Column(nullable = true)
    private Long dogId;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(nullable = false)
    private String transactionBalance;

    @Column(nullable = false, length = 100)
    private String content;

    @Column(nullable = false)
    private String date;

    @Column(nullable = true)
    private Long merchantId;

    @Column(nullable = false)
    private Long shelterId;

    @Column(nullable = false, unique = true, length = 50)
    private String transactionUniqueNo;

    @ManyToOne
    @JoinColumn(name = "file_id", nullable = true)
    private File file;
}