package com.example.demo.controller;

import com.example.demo.entity.UserFavorite;
import com.example.demo.entity.User;
import com.example.demo.service.UserFavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
public class UserFavoriteController {

    private final UserFavoriteService userFavoriteService;

    public UserFavoriteController(UserFavoriteService userFavoriteService) {
        this.userFavoriteService = userFavoriteService;
    }

    private Integer getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            User user = (User) authentication.getPrincipal();
            return user.getId();
        }
        throw new RuntimeException("Kullanıcı kimliği doğrulanamadı");
    }

    @GetMapping
    public ResponseEntity<List<UserFavorite>> getUserFavorites() {
        Integer userId = getCurrentUserId();
        List<UserFavorite> favorites = userFavoriteService.getUserFavorites(userId);
        return ResponseEntity.ok(favorites);
    }

    @PostMapping("/{tireShopId}")
    public ResponseEntity<UserFavorite> addToFavorites(@PathVariable Integer tireShopId) {
        Integer userId = getCurrentUserId();
        UserFavorite favorite = userFavoriteService.addToFavorites(userId, tireShopId);
        return ResponseEntity.ok(favorite);
    }

    @DeleteMapping("/{tireShopId}")
    public ResponseEntity<Void> removeFromFavorites(@PathVariable Integer tireShopId) {
        Integer userId = getCurrentUserId();
        userFavoriteService.removeFromFavorites(userId, tireShopId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{tireShopId}/toggle")
    public ResponseEntity<Map<String, Boolean>> toggleFavorite(@PathVariable Integer tireShopId) {
        Integer userId = getCurrentUserId();
        userFavoriteService.toggleFavorite(userId, tireShopId);
        boolean isFavorite = userFavoriteService.isFavorite(userId, tireShopId);
        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
    }

    @GetMapping("/{tireShopId}/status")
    public ResponseEntity<Map<String, Boolean>> getFavoriteStatus(@PathVariable Integer tireShopId) {
        Integer userId = getCurrentUserId();
        boolean isFavorite = userFavoriteService.isFavorite(userId, tireShopId);
        return ResponseEntity.ok(Map.of("isFavorite", isFavorite));
    }
} 