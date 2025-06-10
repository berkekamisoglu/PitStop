package com.example.demo.pattern.strategy;

import com.example.demo.entity.Tire;
import java.util.Comparator;
import java.util.List;

// DESIGN PATTERN: Strategy Pattern - Concrete Strategy
// Lastikleri fiyata göre artan sıralama stratejisi
public class PriceAscFilter implements TireFilterStrategy {

    @Override
    public List<Tire> filter(List<Tire> tires) {
        tires.sort(Comparator.comparing(Tire::getPrice));
        return tires;
    }
}
