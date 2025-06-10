package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "TireShopServices")
public class TireShopService {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;    @Column(nullable = false)
    private String serviceName;

    @Column(nullable = false)
    private double price;@ManyToOne
    @JoinColumn(name = "tire_shop_id")
    @JsonIgnoreProperties({"services", "tireStocks", "password"}) // Prevent circular reference
    private TireShop tireShop;

    // Getter and Setter
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getServiceName() {
        return serviceName;
    }    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public TireShop getTireShop() {
        return tireShop;
    }

    public void setTireShop(TireShop tireShop) {
        this.tireShop = tireShop;
    }
}
