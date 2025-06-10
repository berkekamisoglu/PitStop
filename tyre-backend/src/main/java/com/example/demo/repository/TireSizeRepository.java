package com.example.demo.repository;

import com.example.demo.entity.TireSize;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TireSizeRepository extends JpaRepository<TireSize, Integer> {
    Optional<TireSize> findBySize(String size);
}
