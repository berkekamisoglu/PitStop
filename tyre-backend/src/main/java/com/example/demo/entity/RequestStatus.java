package com.example.demo.entity;

// DESIGN PATTERN: Enum Pattern (Type-Safe Constant Pattern)
// Servis talebi durumları için tip güvenliği sağlar
// State Pattern'in temelini oluşturur
public enum RequestStatus {
    PENDING,
    ACCEPTED,
    COMPLETED
}
