package com.yoohoo.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UserKeyRequestDto {
    @JsonProperty("apiKey")
    private String apiKey = "54cc585638ea49a5b13f7ec7887c7c1b"; // 고정된 API 키

    @JsonProperty("userId")
    private String userId; // 카카오 이메일
}