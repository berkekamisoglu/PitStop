package com.example.demo.controller;

import com.example.demo.entity.VehicleType;
import com.example.demo.service.VehicleTypeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicle-types")
public class VehicleTypeController {

    private final VehicleTypeService vehicleTypeService;

    public VehicleTypeController(VehicleTypeService vehicleTypeService) {
        this.vehicleTypeService = vehicleTypeService;
    }

    @GetMapping
    public List<VehicleType> getAllVehicleTypes() {
        return vehicleTypeService.getAllVehicleTypes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleType> getVehicleTypeById(@PathVariable int id) {
        VehicleType vehicleType = vehicleTypeService.getVehicleTypeById(id);
        if (vehicleType != null) {
            return ResponseEntity.ok(vehicleType);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<VehicleType> createVehicleType(@RequestBody VehicleType vehicleType) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleTypeService.createVehicleType(vehicleType));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleType> updateVehicleType(@PathVariable int id, @RequestBody VehicleType updated) {
        VehicleType result = vehicleTypeService.updateVehicleType(id, updated);
        if (result != null) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicleType(@PathVariable int id) {
        if (vehicleTypeService.deleteVehicleType(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
} 