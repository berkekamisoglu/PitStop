package com.example.demo.pattern.factory;

// DESIGN PATTERN: Factory Pattern - Concrete Product
// Nakit ödeme işlemini gerçekleştiren concrete implementation
public class CashProcessor implements PaymentProcessor {
    @Override
    public void process(double amount) {
        System.out.println("Nakit ödeme işlendi: " + amount + "₺");
    }
}
