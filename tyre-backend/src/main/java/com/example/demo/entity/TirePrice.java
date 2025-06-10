package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "TirePrices")
public class TirePrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private double price;

    @ManyToOne
    @JoinColumn(name = "tire_id")
    private Tire tire;

    @ManyToOne
    @JoinColumn(name = "tire_shop_id")
    private TireShop tireShop;

    // Getter and Setter
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public Tire getTire() {
        return tire;
    }

    public void setTire(Tire tire) {
        this.tire = tire;
    }

    public TireShop getTireShop() {
        return tireShop;
    }

    public void setTireShop(TireShop tireShop) {
        this.tireShop = tireShop;
    }
}
