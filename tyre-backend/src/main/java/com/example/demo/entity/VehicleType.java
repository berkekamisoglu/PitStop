package com.example.demo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "VehicleTypes")
public class VehicleType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String typeName;

    @JsonIgnore
    @OneToMany(mappedBy = "vehicleType")
    private List<UserVehicle> userVehicles;

    // Getter and Setter
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTypeName() {
        return typeName;
    }

    public void setTypeName(String typeName) {
        this.typeName = typeName;
    }

    public List<UserVehicle> getUserVehicles() {
        return userVehicles;
    }

    public void setUserVehicles(List<UserVehicle> userVehicles) {
        this.userVehicles = userVehicles;
    }
}
