package com.example.demo.service;

import com.example.demo.entity.Review;
import com.example.demo.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @Transactional(readOnly = true)
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }    @Transactional(readOnly = true)
    public Review getReviewById(int id) {
        return reviewRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Review> getReviewsByShopId(int shopId) {
        return reviewRepository.findByTireShopId(shopId);
    }

    @Transactional
    public Review createReview(Review review) {
        return reviewRepository.save(review);
    }

    @Transactional
    public Review updateReview(int id, Review updated) {
        Review existing = reviewRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setRating(updated.getRating());
            existing.setComment(updated.getComment());
            existing.setUser(updated.getUser());
            existing.setTireShop(updated.getTireShop());
            return reviewRepository.save(existing);
        }
        return null;
    }

    @Transactional
    public boolean deleteReview(int id) {
        if (reviewRepository.existsById(id)) {
            reviewRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
