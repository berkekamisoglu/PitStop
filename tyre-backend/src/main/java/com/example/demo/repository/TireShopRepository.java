package com.example.demo.repository;

import com.example.demo.entity.TireShop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// DESIGN PATTERN: Repository Pattern
// Veri erişim katmanını soyutlar ve domain nesneleri için CRUD operasyonları sağlar
// Spring Data JPA ile otomatik implementation
@Repository
public interface TireShopRepository extends JpaRepository<TireShop, Integer> {
    Optional<TireShop> findByEmail(String email);
}
