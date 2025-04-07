package com.yoohoo.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class UserKeyResponseDto {
    @JsonProperty("userId")
    private String userId;

    @JsonProperty("userName")
    private String userName;

    @JsonProperty("institutionCode")
    private String institutionCode;

    @JsonProperty("userKey")
    private String userKey;

    @JsonProperty("created")
    private String created;

    @JsonProperty("modified")
    private String modified;
}