package com.yoohoo.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    // @Value("${kakao.client-id}")
    // private String kakaoClientId;

    // @Value("${KAKAO_REDIRECT_URI}")
    // private String kakaoRedirectUri;

    // @GetMapping("/")
    // public String index(Model model) {
    //     model.addAttribute("kakaoClientId", kakaoClientId);
    //     model.addAttribute("kakaoRedirectUri", kakaoRedirectUri);
    //     return "index";
    // }

    // @GetMapping("/home")
    // public String home() {
    //     return "home"; // home.html을 반환
    // }
}