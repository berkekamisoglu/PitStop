package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// DESIGN PATTERN: Main Application Entry Point Pattern
// Spring Boot'un ana giriş noktası - Application başlatma sorumluluğunu üstlenir
@SpringBootApplication
public class TyreApp {

	public static void main(String[] args) {
		SpringApplication.run(TyreApp.class, args);
	}

}
