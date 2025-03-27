package com.yoohoo.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }
}

@Component
class MyComponent {

    @Value("${DATABASE_URL}")
    private String databaseUrl;

    @Value("${DATABASE_USERNAME}")
    private String databaseUsername;

    @Value("${DATABASE_PASSWORD}")
    private String databasePassword;

    @PostConstruct
    public void init() {
        System.out.println("DATABASE_URL: " + databaseUrl);
        System.out.println("DATABASE_USERNAME: " + databaseUsername);
        System.out.println("DATABASE_PASSWORD: " + databasePassword);
    }
}