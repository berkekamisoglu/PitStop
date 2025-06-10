package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

// DESIGN PATTERN: Entity Pattern (Domain Model Pattern)
// Randevu domain nesnesini temsil eder
// Builder Pattern ile oluşturulabilir (AppointmentBuilder kullanılarak)
// Observer Pattern ile oluşturulduğunda bildirimler tetiklenir
@Entity
@Table(name = "Appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private LocalDateTime appointmentDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "shop_id")
    private TireShop tireShop;    @ManyToOne
    @JoinColumn(name = "service_id")
    private TireShopService service;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private UserVehicle vehicle;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;

    // Getter ve Setter
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
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

    public TireShopService getService() {
        return service;
    }

    public void setService(TireShopService service) {
        this.service = service;
    }

    public AppointmentStatus getStatus() {
        return status;
    }    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public UserVehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(UserVehicle vehicle) {
        this.vehicle = vehicle;
    }
}
