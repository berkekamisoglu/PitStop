package com.example.demo.dto;

// DESIGN PATTERN: Data Transfer Object (DTO) Pattern
// Kimlik doğrulama isteği için veri taşıma nesnesi
// Client ve server arasında veri transferini sağlar
public class AuthRequest {
    private String email;
    private String password;
    
    // Default constructor for JSON deserialization
    public AuthRequest() {
    }

    public AuthRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}


