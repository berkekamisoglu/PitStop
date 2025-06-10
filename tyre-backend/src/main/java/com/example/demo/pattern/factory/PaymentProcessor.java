package com.example.demo.pattern.factory;

// DESIGN PATTERN: Factory Pattern - Product Interface
// Farklı ödeme işlemcilerinin ortak arayüzü
public interface PaymentProcessor {
    void process(double amount);
}
