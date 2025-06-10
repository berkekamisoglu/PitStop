package com.example.demo.service;

import com.example.demo.entity.PaymentMethod;
import com.example.demo.repository.PaymentMethodRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PaymentMethodService {

    private final PaymentMethodRepository methodRepository;

    public PaymentMethodService(PaymentMethodRepository methodRepository) {
        this.methodRepository = methodRepository;
    }

    @Transactional(readOnly = true)
    public List<PaymentMethod> getAll() {
        return methodRepository.findAll();
    }

    @Transactional
    public PaymentMethod create(PaymentMethod method) {
        return methodRepository.save(method);
    }

    @Transactional
    public boolean delete(int id) {
        if (methodRepository.existsById(id)) {
            methodRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
