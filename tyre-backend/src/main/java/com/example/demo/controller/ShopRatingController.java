package com.example.demo.controller;

import com.example.demo.entity.ShopRating;
import com.example.demo.service.ShopRatingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shop-ratings")
public class ShopRatingController {

    private final ShopRatingService shopRatingService;

    public ShopRatingController(ShopRatingService shopRatingService) {
        this.shopRatingService = shopRatingService;
    }

    @GetMapping
    public List<ShopRating> getAllRatings() {
        return shopRatingService.getAllRatings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ShopRating> getRatingById(@PathVariable int id) {
        ShopRating rating = shopRatingService.getRatingById(id);
        return rating != null ? ResponseEntity.ok(rating) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<ShopRating> createRating(@RequestBody ShopRating rating) {
        return ResponseEntity.ok(shopRatingService.createRating(rating));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ShopRating> updateRating(@PathVariable int id, @RequestBody ShopRating updated) {
        ShopRating result = shopRatingService.updateRating(id, updated);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRating(@PathVariable int id) {
        return shopRatingService.deleteRating(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
