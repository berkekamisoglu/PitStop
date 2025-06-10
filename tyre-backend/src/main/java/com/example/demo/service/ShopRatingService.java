package com.example.demo.service;

import com.example.demo.entity.ShopRating;
import com.example.demo.repository.ShopRatingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ShopRatingService {

    private final ShopRatingRepository ratingRepository;

    public ShopRatingService(ShopRatingRepository ratingRepository) {
        this.ratingRepository = ratingRepository;
    }

    @Transactional(readOnly = true)
    public List<ShopRating> getAllRatings() {
        return ratingRepository.findAll();
    }

    @Transactional(readOnly = true)
    public ShopRating getRatingById(int id) {
        return ratingRepository.findById(id).orElse(null);
    }

    @Transactional
    public ShopRating createRating(ShopRating rating) {
        return ratingRepository.save(rating);
    }

    @Transactional
    public ShopRating updateRating(int id, ShopRating updated) {
        ShopRating existing = ratingRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setRating(updated.getRating());
            existing.setTotalReviews(updated.getTotalReviews());
            existing.setShop(updated.getShop());
            return ratingRepository.save(existing);
        }
        return null;
    }

    @Transactional
    public boolean deleteRating(int id) {
        if (ratingRepository.existsById(id)) {
            ratingRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
