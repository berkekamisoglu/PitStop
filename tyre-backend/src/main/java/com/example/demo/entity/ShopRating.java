package com.example.demo.entity;

import jakarta.persistence.*;


 
@Entity
@Table(name = "ShopRatings")
public class ShopRating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "tire_shop_id")
    private TireShop shop;

    private double rating;
    private int totalReviews;

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public TireShop getShop() {
        return shop;
    }

    public void setShop(TireShop shop) {
        this.shop = shop;
    }

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(int totalReviews) {
        this.totalReviews = totalReviews;
    }
}

