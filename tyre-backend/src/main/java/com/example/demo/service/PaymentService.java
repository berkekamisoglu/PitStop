package com.example.demo.service;

import com.example.demo.entity.Payment;
import com.example.demo.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Transactional(readOnly = true)
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Payment getById(int id) {
        return paymentRepository.findById(id).orElse(null);
    }

    @Transactional
    public Payment create(Payment payment) {
        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment update(int id, Payment updated) {
        Payment existing = paymentRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setAmount(updated.getAmount());
            existing.setUser(updated.getUser());
            existing.setPaymentDate(updated.getPaymentDate());
            existing.setPaymentMethod(updated.getPaymentMethod());
            existing.setSuccessful(updated.isSuccessful());
            return paymentRepository.save(existing);
        }
        return null;
    }

    @Transactional
    public boolean delete(int id) {
        if (paymentRepository.existsById(id)) {
            paymentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
