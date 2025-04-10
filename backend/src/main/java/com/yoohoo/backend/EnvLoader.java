package com.yoohoo.backend;

import io.github.cdimascio.dotenv.Dotenv;

public class EnvLoader {
    static {
        // Specify the path to the .env file
        Dotenv dotenv = Dotenv.configure()
                              .directory("C:/Users/SSAFY/S12P21B209/backend/.env")
                              .load();
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));
    }
}