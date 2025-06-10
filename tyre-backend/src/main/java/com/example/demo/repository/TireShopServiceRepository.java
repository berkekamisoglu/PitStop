package com.example.demo.repository;

import com.example.demo.entity.TireShopService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TireShopServiceRepository extends JpaRepository<TireShopService, Integer> {
    List<TireShopService> findByTireShopId(int shopId);
}
