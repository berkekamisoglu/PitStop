package com.example.demo.pattern.factory;

// DESIGN PATTERN: Factory Pattern - Concrete Product
// Havale/EFT ödeme işlemini gerçekleştiren concrete implementation
public class TransferProcessor implements PaymentProcessor {
    @Override
    public void process(double amount) {
        System.out.println("Havale ile ödeme işlendi: " + amount + "₺");
    }
}
