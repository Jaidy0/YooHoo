package com.yoohoo.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long donationId;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "shelterId", nullable = false)
    private Shelter shelter;

    @Column(nullable = false)
    private LocalDate donationDate;

    @Column(nullable = false)
    private String withdrawalAccount;

    @Column(nullable = false)
    private Integer donationType; // 0: 일시 후원, 1: 정기 후원

    @Column
    private LocalDate regularDonationDate;

    @ManyToOne
    @JoinColumn(name = "dogId", nullable = true)
    private Dog dog;

    @Column(nullable = false)
    private String depositorName;

    @Column(columnDefinition = "TEXT")
    private String cheeringMessage;

    @Column(nullable = false)
    private Integer donationAmount;

    @Column(nullable = false)
    private String transactionUniqueNo;

    // Getters and Setters
    // ...
}