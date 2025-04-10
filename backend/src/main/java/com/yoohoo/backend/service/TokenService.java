package com.yoohoo.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class TokenService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    private static final String TOKEN_PREFIX = "kakao:token:";
    private static final String REFRESH_TOKEN_PREFIX = "kakao:refresh_token:";
    private static final long TOKEN_EXPIRATION = 60 * 60 * 24; // 24시간 (초 단위)
    private static final long REFRESH_TOKEN_EXPIRATION = 60 * 60 * 24 * 30; // 30일 (초 단위)

    // 사용자 ID를 키로 토큰 저장
    public void saveToken(Long userId, String accessToken) {
        String key = TOKEN_PREFIX + userId;
        redisTemplate.opsForValue().set(key, accessToken, TOKEN_EXPIRATION, TimeUnit.SECONDS);
    }

    // 사용자 ID로 토큰 조회
    public String getToken(Long userId) {
        String key = TOKEN_PREFIX + userId;
        return redisTemplate.opsForValue().get(key);
    }

    // 토큰 삭제
    public void deleteToken(Long userId) {
        String key = TOKEN_PREFIX + userId;
        redisTemplate.delete(key);
    }

    // 리프레시 토큰 저장
    public void saveRefreshToken(Long userId, String refreshToken) {
        String key = REFRESH_TOKEN_PREFIX + userId;
        redisTemplate.opsForValue().set(key, refreshToken, REFRESH_TOKEN_EXPIRATION, TimeUnit.SECONDS);
    }

    // 리프레시 토큰 조회
    public String getRefreshToken(Long userId) {
        String key = REFRESH_TOKEN_PREFIX + userId;
        return redisTemplate.opsForValue().get(key);
    }

    // 리프레시 토큰 삭제
    public void deleteRefreshToken(Long userId) {
        String key = REFRESH_TOKEN_PREFIX + userId;
        redisTemplate.delete(key);
    }
}