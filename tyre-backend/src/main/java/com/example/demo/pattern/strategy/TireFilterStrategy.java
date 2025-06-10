package com.example.demo.pattern.strategy;

import com.example.demo.entity.Tire;

import java.util.List;

// DESIGN PATTERN: Strategy Pattern - Interface
// Farklı lastik filtreleme algoritmalarını tanımlar
// Her concrete strategy sınıfı bu interface'i implement eder
public interface TireFilterStrategy {
    List<Tire> filter(List<Tire> tires);
}
