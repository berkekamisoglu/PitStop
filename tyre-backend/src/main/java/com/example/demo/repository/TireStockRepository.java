package com.example.demo.repository;

import com.example.demo.entity.TireStock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TireStockRepository extends JpaRepository<TireStock, Integer> {
    List<TireStock> findByTireShopId(int shopId);
}
