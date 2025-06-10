package com.example.demo.controller;

import com.example.demo.entity.UserVehicle;
import com.example.demo.service.UserVehicleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-vehicles")
public class UserVehicleController {

    private final UserVehicleService userVehicleService;

    public UserVehicleController(UserVehicleService userVehicleService) {
        this.userVehicleService = userVehicleService;
    }

    @GetMapping
    public List<UserVehicle> getAllVehicles() {
        return userVehicleService.getAllVehicles();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserVehicle> getVehicleById(@PathVariable int id) {
        UserVehicle vehicle = userVehicleService.getVehicleById(id);
        if (vehicle != null) {
            return ResponseEntity.ok(vehicle);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<UserVehicle> createVehicle(@RequestBody UserVehicle vehicle) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userVehicleService.createVehicle(vehicle));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserVehicle> updateVehicle(@PathVariable int id, @RequestBody UserVehicle updated) {
        UserVehicle result = userVehicleService.updateVehicle(id, updated);
        if (result != null) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable int id) {
        if (userVehicleService.deleteVehicle(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
