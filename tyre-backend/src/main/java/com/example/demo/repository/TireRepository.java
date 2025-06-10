package com.example.demo.repository;

import com.example.demo.entity.Tire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TireRepository extends JpaRepository<Tire, Integer> {
}
