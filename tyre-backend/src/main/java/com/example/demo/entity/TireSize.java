package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "TireSizes")
public class TireSize {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String size;

    @JsonIgnore
    @OneToMany(mappedBy = "tireSize")
    private List<UserVehicle> vehicles;

    @JsonIgnore
    @OneToMany(mappedBy = "tireSize")
    private List<Tire> tires;

    // Getter ve Setter'lar

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public List<UserVehicle> getVehicles() {
        return vehicles;
    }

    public void setVehicles(List<UserVehicle> vehicles) {
        this.vehicles = vehicles;
    }

    public List<Tire> getTires() {
        return tires;
    }

    public void setTires(List<Tire> tires) {
        this.tires = tires;
    }
}

