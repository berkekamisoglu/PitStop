package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

// DESIGN PATTERN: Entity Pattern (Domain Model Pattern)
// Lastik dükkanı domain nesnesini temsil eder
// Coğrafi konum bilgileri ve hizmet ilişkileri içerir
@Entity
@Table(name = "TireShops")
public class TireShop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String shopName;

    @Column(unique = true)
    private String email;

    private String password;

    private String phone;

    private String address;

    private Double latitude;

    private Double longitude;

    private String openingHour;

    private String closingHour;

    @ManyToOne
    @JoinColumn(name = "location_id")
    private Location location;

    @OneToMany(mappedBy = "tireShop")
    @JsonIgnoreProperties({"tireShop"}) // Prevent circular reference when serializing services
    private List<TireShopService> services;

    @OneToMany(mappedBy = "tireShop")
    @JsonIgnoreProperties({"tireShop"}) // Prevent circular reference when serializing tireStocks
    private List<TireStock> tireStocks;

    // Getter and Setter
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getOpeningHour() {
        return openingHour;
    }

    public void setOpeningHour(String openingHour) {
        this.openingHour = openingHour;
    }

    public String getClosingHour() {
        return closingHour;
    }

    public void setClosingHour(String closingHour) {
        this.closingHour = closingHour;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public List<TireShopService> getServices() {
        return services;
    }

    public void setServices(List<TireShopService> services) {
        this.services = services;
    }

    public List<TireStock> getTireStocks() {
        return tireStocks;
    }

    public void setTireStocks(List<TireStock> tireStocks) {
        this.tireStocks = tireStocks;
    }
}
