package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "TireStock")
public class TireStock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;    @ManyToOne
    @JoinColumn(name = "tire_id")
    @JsonIgnoreProperties({"tireStocks"}) // Circular reference'ı önle
    private Tire tire;

    @ManyToOne
    @JoinColumn(name = "tire_shop_id") // Bu ÇOK önemli!
    @JsonIgnoreProperties({"tireStocks", "password"}) // Circular reference'ı önle
    private TireShop tireShop;

    private int stockQuantity;

    // Getter Setter
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public int getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(int stockQuantity) {
        this.stockQuantity = stockQuantity;
    }
}
