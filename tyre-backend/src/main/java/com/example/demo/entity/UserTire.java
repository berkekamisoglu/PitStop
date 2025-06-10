package com.example.demo.entity;


import jakarta.persistence.*;



@Entity
@Table(name = "UserTires")
public class UserTire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "tire_size_id")
    private TireSize tireSize;

    // Getter and Setter methods

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public TireSize getTireSize() {
        return tireSize;
    }

    public void setTireSize(TireSize tireSize) {
        this.tireSize = tireSize;
    }
}


