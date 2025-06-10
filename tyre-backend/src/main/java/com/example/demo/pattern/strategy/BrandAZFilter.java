package com.example.demo.pattern.strategy;

import com.example.demo.entity.Tire;
import java.util.Comparator;
import java.util.List;

// DESIGN PATTERN: Strategy Pattern - Concrete Strategy
// Lastikleri marka adına göre A-Z sıralama stratejisi
public class BrandAZFilter implements TireFilterStrategy {

    @Override
    public List<Tire> filter(List<Tire> tires) {
        tires.sort(Comparator.comparing(Tire::getBrand));
        return tires;
    }
}
