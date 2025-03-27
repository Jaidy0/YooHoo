package com.yoohoo.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(unique = true, nullable = false)
    private Long kakaoId;

    @Column(length = 30, nullable = true)
    private String kakaoEmail;

    @Column(length = 50, nullable = true)
    private String nickname;

    @Column(nullable = false)
    private Boolean isAdmin;

    @ManyToOne
    @JoinColumn(name = "shelterId", nullable = true)
    private Shelter shelter;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    public Long getShelterId() {
        return shelter != null ? shelter.getShelterId() : null;
    }

}