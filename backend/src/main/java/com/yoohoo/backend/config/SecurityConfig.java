package com.yoohoo.backend.config;

import com.yoohoo.backend.filter.SessionRefreshFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final SessionRefreshFilter sessionRefreshFilter;

    public SecurityConfig(SessionRefreshFilter sessionRefreshFilter) {
        this.sessionRefreshFilter = sessionRefreshFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // CSRF 비활성화
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // 모든 요청 허용
            )
            .addFilterBefore(sessionRefreshFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
    