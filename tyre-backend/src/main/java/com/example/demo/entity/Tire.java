package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Tires")
public class Tire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String brand;

    private String model;

    private double price; // ← EKLENEN ALAN

    @ManyToOne
    @JoinColumn(name = "tire_size_id")
    private TireSize tireSize;

    // Getter and Setter
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public TireSize getTireSize() {
        return tireSize;
    }

    public void setTireSize(TireSize tireSize) {
        this.tireSize = tireSize;
    }
}

