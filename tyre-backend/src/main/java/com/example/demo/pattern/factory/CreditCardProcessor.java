package com.example.demo.pattern.factory;

// DESIGN PATTERN: Factory Pattern - Concrete Product
// Kredi kartı ile ödeme işlemini gerçekleştiren concrete implementation
public class CreditCardProcessor implements PaymentProcessor {
    @Override
    public void process(double amount) {
        System.out.println("Kredi kartıyla ödeme işlendi: " + amount + "₺");
    }
}
