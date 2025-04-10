package com.yoohoo.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Date;
import java.time.LocalDate;

@Entity
@Data
public class Dog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dogId;

    @Column(length = 30, nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false)
    private Integer weight;

    @Column(nullable = false)
    private Integer gender;

    @Column(columnDefinition = "TEXT")
    private String breed;

    @Column(nullable = false)
    private Integer energetic;

    @Column(nullable = false)
    private Integer familiarity;

    @Column(nullable = false)
    private Boolean isVaccination;

    @Column(nullable = false)
    private Boolean isNeutered;

    @Column(nullable = false)
    private Integer status;

    @Column(nullable = false)
    private LocalDate admissionDate;

    @ManyToOne
    @JoinColumn(name = "shelterId", nullable = false)
    private Shelter shelter;
}