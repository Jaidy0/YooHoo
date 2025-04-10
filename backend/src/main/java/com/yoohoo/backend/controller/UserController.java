package com.yoohoo.backend.controller;

import com.yoohoo.backend.service.UserService;
import com.yoohoo.backend.service.SsafyFinService;
import com.yoohoo.backend.dto.KakaoLoginDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.view.RedirectView;
import jakarta.servlet.http.HttpSession;
import com.yoohoo.backend.entity.User;
import java.util.Map;
import org.springframework.http.MediaType;
import java.util.HashMap;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private SsafyFinService ssafyFinService;


    @GetMapping("/kakao-login")
    public RedirectView kakaoLogin(@RequestParam("code") String code, HttpSession session) {
        try {
            // 카카오 API로 액세스 토큰 요청
            String accessToken = userService.getAccessTokenFromKakao(code);
            logger.info("Access token received: {}", accessToken);
            
            // 액세스 토큰으로 사용자 정보 요청
            KakaoLoginDto userInfo = userService.getUserInfoFromKakao(accessToken);
            logger.info("User info retrieved: {}", userInfo);
            
            // 사용자 정보 저장 및 토큰 Redis에 저장
            User user = userService.saveUserWithToken(userInfo, accessToken);
            logger.info("User saved: {}", user);
            
            // 세션에 사용자 ID 저장 (인증 목적)
            session.setAttribute("userId", user.getUserId());
            logger.info("User ID stored in session: {}", user.getUserId());

            // 카카오 ID를 통해 데이터베이스에서 이메일 정보 가져오기
            Long kakaoId = user.getKakaoId(); // 데이터베이스에 저장된 카카오 ID
            User dbUser = userService.findUserByKakaoId(kakaoId); // 카카오 ID로 사용자 조회
            String userId = dbUser.getKakaoEmail(); // 데이터베이스에서 이메일 가져오기

            // 요청 본문 준비
            String apiKey = "54cc585638ea49a5b13f7ec7887c7c1b";
            String requestBody = String.format("{\"apiKey\":\"%s\", \"userId\":\"%s\"}", apiKey, userId);
            
            // 로그 추가
            logger.info("Sending POST request to external API with userId: {}", userId);
            logger.info("Request body: {}", requestBody);
            
            // 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            // 요청 엔티티 생성
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);
            
            // POST 요청 전송
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<Map> response = restTemplate.exchange(
                    "https://finopenapi.ssafy.io/ssafy/api/v1/member/search",
                    HttpMethod.POST,
                    entity,
                    Map.class
            );

            // 응답 상태 코드 확인
            if (!response.getStatusCode().is2xxSuccessful()) {
                logger.error("Failed to call external API: {}", response.getBody());
                throw new RuntimeException("Failed to call external API");
            }

            // 응답에서 userKey 추출
            String userKey = (String) response.getBody().get("userKey");
            // Redis에 userKey 저장
            userService.storeUserKeyInRedis(user.getUserId(), userKey);
            
            return new RedirectView("/yoohoo/login/callback");
        } catch (Exception e) {
            logger.error("Kakao 로그인 중 오류 발생", e);
            return new RedirectView("/yoohoo/login/error");
        }
    }

    @PostMapping("/kakao-logout")
    public RedirectView unlink(HttpSession session) {
        try {
            // 세션에서 사용자 ID 가져오기
            Long userId = (Long) session.getAttribute("userId");
            
            if (userId == null) {
                logger.error("User not logged in");
                return new RedirectView("/yoohoo/login/error");
            }
            
            // Redis에서 토큰 가져오기
            String accessToken = userService.getUserToken(userId);
            
            if (accessToken == null) {
                logger.error("Access token not found for user: {}", userId);
                return new RedirectView("/yoohoo/login/error");
            }
            
            // 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", "Bearer " + accessToken);
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // 카카오 API 호출 (연결 끊기)
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> unlinkResponse = restTemplate.exchange(
                    "https://kapi.kakao.com/v1/user/unlink",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            // 카카오 연결 해제 성공 확인
            if (!unlinkResponse.getStatusCode().is2xxSuccessful()) {
                logger.error("Failed to unlink with Kakao: {}", unlinkResponse.getBody());
                return new RedirectView("/yoohoo/login/error");
            }

            // 토큰 삭제 및 사용자 정보 업데이트
            userService.unlinkUser(userId);
            
            // Redis에서 userKey 삭제
            userService.deleteUserKeyFromRedis(userId);
            
            // Redis에서 사용자 정보 삭제
            userService.deleteUserInfoFromRedis(userId);
            
            // 세션 정보 삭제
            session.invalidate();
            
            // 연결 끊기 성공 시 메인 페이지로 리디렉션
            return new RedirectView("/");
        } catch (Exception e) {
            logger.error("Error during unlink", e);
            return new RedirectView("/yoohoo/login/error");
        }
    }

    @PostMapping("/logout")
    public RedirectView logout(HttpSession session) {
        try {
            // 세션에서 사용자 ID 가져오기
            Long userId = (Long) session.getAttribute("userId");
            
            if (userId == null) {
                logger.error("User not logged in");
                return new RedirectView("/yoohoo/login/error");
            }

            // 사용자 정보 삭제
            userService.unlinkUser(userId);
            
            // Redis에서 userKey 삭제
            userService.deleteUserKeyFromRedis(userId);
            
            // Redis에서 사용자 정보 삭제
            userService.deleteUserInfoFromRedis(userId);
            
            // 세션 정보 삭제
            session.invalidate();
            
            // 로그아웃 성공 시 메인 페이지로 리디렉션
            return new RedirectView("/");
        } catch (Exception e) {
            logger.error("Error during logout", e);
            return new RedirectView("/yoohoo/login/error");
        }
    }

    @PutMapping("/{userId}/nickname")
    public ResponseEntity<User> updateNickname(@PathVariable Long userId, @RequestBody Map<String, String> requestBody) {
        String newNickname = requestBody.get("newNickname");
        User updatedUser = userService.updateNickname(userId, newNickname);
        return ResponseEntity.ok(updatedUser);
    }

    @GetMapping("/user-info")
    public ResponseEntity<Map<String, Object>> getUserInfo(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }

        User user = userService.findById(userId);
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("userId", user.getUserId());
        userInfo.put("kakaoEmail", user.getKakaoEmail());
        userInfo.put("nickname", user.getNickname());
        userInfo.put("isAdmin", user.getIsAdmin() != null && user.getIsAdmin());
        userInfo.put("shelterId", user.getShelterId());
        userInfo.put("createdAt", user.getCreatedAt());

        return ResponseEntity.ok(userInfo);
    }

    @PostMapping("/ssafyfin/create")
    public Map<String, Object> initializeFund(@RequestBody Map<String, String> requestBody) {
        String email = requestBody.get("email");
        return ssafyFinService.initializeFund(email);
    }
}