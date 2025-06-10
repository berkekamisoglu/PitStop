package com.example.demo.service;

import com.example.demo.entity.UserFavorite;
import com.example.demo.entity.User;
import com.example.demo.entity.TireShop;
import com.example.demo.repository.UserFavoriteRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.TireShopRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserFavoriteService {

    private final UserFavoriteRepository userFavoriteRepository;
    private final UserRepository userRepository;
    private final TireShopRepository tireShopRepository;

    public UserFavoriteService(UserFavoriteRepository userFavoriteRepository, 
                              UserRepository userRepository, 
                              TireShopRepository tireShopRepository) {
        this.userFavoriteRepository = userFavoriteRepository;
        this.userRepository = userRepository;
        this.tireShopRepository = tireShopRepository;
    }

    public List<UserFavorite> getUserFavorites(Integer userId) {
        return userFavoriteRepository.findByUserId(userId);
    }

    @Transactional
    public UserFavorite addToFavorites(Integer userId, Integer tireShopId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        
        TireShop tireShop = tireShopRepository.findById(tireShopId)
                .orElseThrow(() -> new RuntimeException("Lastikçi bulunamadı"));

        // Check if already favorited
        if (userFavoriteRepository.existsByUserIdAndTireShopId(userId, tireShopId)) {
            throw new RuntimeException("Bu lastikçi zaten favorilerinizde");
        }

        UserFavorite favorite = new UserFavorite(user, tireShop);
        return userFavoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFromFavorites(Integer userId, Integer tireShopId) {
        if (!userFavoriteRepository.existsByUserIdAndTireShopId(userId, tireShopId)) {
            throw new RuntimeException("Bu lastikçi favorilerinizde değil");
        }
        userFavoriteRepository.deleteByUserIdAndTireShopId(userId, tireShopId);
    }

    public boolean isFavorite(Integer userId, Integer tireShopId) {
        return userFavoriteRepository.existsByUserIdAndTireShopId(userId, tireShopId);
    }

    @Transactional
    public void toggleFavorite(Integer userId, Integer tireShopId) {
        if (isFavorite(userId, tireShopId)) {
            removeFromFavorites(userId, tireShopId);
        } else {
            addToFavorites(userId, tireShopId);
        }
    }
} 