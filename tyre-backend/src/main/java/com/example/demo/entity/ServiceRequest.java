package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.sql.Timestamp;

// DESIGN PATTERN: Entity Pattern (Domain Model Pattern)
// Acil yardım talebi domain nesnesini temsil eder
// State pattern'e uygun olarak status field'i ile durum yönetimi yapar
@Entity
@Table(name = "ServiceRequests")
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String title;
    
    private double latitude;
    private double longitude;

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    @Enumerated(EnumType.STRING)
    private Priority priority = Priority.MEDIUM;

    private String description;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"vehicles", "password", "userRole", "createdAt", "version"})
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "tire_shop_id")
    @JsonIgnoreProperties({"password", "services", "tireStock"})
    private TireShop tireShop; // İşi alan lastikçi (baştan null olacak)

    // Getter-Setter

    // id
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    // title
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    // priority
    public Priority getPriority() {
        return priority;
    }
    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    // latitude
    public double getLatitude() {
        return latitude;
    }
    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    // longitude
    public double getLongitude() {
        return longitude;
    }
    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    // status
    public RequestStatus getStatus() {
        return status;
    }
    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    // description
    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    // createdAt
    public Timestamp getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    // user
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user = user;
    }

    // tireShop
    public TireShop getTireShop() {
        return tireShop;
    }
    public void setTireShop(TireShop tireShop) {
        this.tireShop = tireShop;
    }
}
