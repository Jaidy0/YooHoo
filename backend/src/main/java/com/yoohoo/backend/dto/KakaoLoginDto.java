package com.yoohoo.backend.dto;

public class KakaoLoginDto {

    private Long kakaoId;
    private String email;

    // Getters and Setters
    public Long getKakaoId() {
        return kakaoId;
    }

    public void setKakaoId(Long kakaoId) {
        this.kakaoId = kakaoId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}