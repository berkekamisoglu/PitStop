package com.example.demo.repository;

import com.example.demo.entity.UserFavorite;
import com.example.demo.entity.User;
import com.example.demo.entity.TireShop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserFavoriteRepository extends JpaRepository<UserFavorite, Long> {
    
    List<UserFavorite> findByUser(User user);
    
    List<UserFavorite> findByUserId(Integer userId);
    
    Optional<UserFavorite> findByUserAndTireShop(User user, TireShop tireShop);
    
    Optional<UserFavorite> findByUserIdAndTireShopId(Integer userId, Integer tireShopId);
    
    boolean existsByUserIdAndTireShopId(Integer userId, Integer tireShopId);
    
    void deleteByUserIdAndTireShopId(Integer userId, Integer tireShopId);
} 