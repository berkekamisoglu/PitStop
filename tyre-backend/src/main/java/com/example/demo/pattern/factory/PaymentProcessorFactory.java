package com.example.demo.pattern.factory;

// DESIGN PATTERN: Factory Pattern - Factory Class
// Ödeme yöntemine göre uygun PaymentProcessor instance'ı oluşturur
// Client kod hangi concrete class'ın kullanılacağını bilmek zorunda değil
public class PaymentProcessorFactory {

    public static PaymentProcessor getProcessor(String methodName) {
        return switch (methodName.toLowerCase()) {
            case "kredi kartı" -> new CreditCardProcessor();
            case "nakit" -> new CashProcessor();
            case "havale" -> new TransferProcessor();
            default -> throw new IllegalArgumentException("Bilinmeyen ödeme yöntemi: " + methodName);
        };
    }
}
