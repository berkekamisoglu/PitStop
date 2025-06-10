package com.example.demo.repository;

import com.example.demo.entity.TirePrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TirePriceRepository extends JpaRepository<TirePrice, Integer> {
}
