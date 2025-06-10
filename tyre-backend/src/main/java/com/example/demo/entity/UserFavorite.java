package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_favorites")
public class UserFavorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "tire_shop_id", nullable = false)
    private TireShop tireShop;

    // Constructors
    public UserFavorite() {}

    public UserFavorite(User user, TireShop tireShop) {
        this.user = user;
        this.tireShop = tireShop;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public TireShop getTireShop() {
        return tireShop;
    }

    public void setTireShop(TireShop tireShop) {
        this.tireShop = tireShop;
    }
} 