package com.example.demo.service;

import com.example.demo.entity.Tire;
import com.example.demo.pattern.strategy.TireFilterStrategy;
import org.springframework.stereotype.Service;

import java.util.List;

// DESIGN PATTERN: Strategy Pattern - Context Class
// Runtime'da farklı filtreleme stratejilerini değiştirebilir
// Strategy interface'ini kullanarak filtreleme algoritmasını delegate eder
@Service
public class TireFilterService {

    private TireFilterStrategy strategy;

    public void setStrategy(TireFilterStrategy strategy) {
        this.strategy = strategy;
    }

    public List<Tire> applyFilter(List<Tire> tires) {
        return strategy.filter(tires);
    }
}
