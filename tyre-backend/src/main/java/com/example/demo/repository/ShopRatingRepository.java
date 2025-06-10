package com.example.demo.repository;

import com.example.demo.entity.ShopRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShopRatingRepository extends JpaRepository<ShopRating, Integer> {
}
