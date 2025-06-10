package com.example.demo.controller;

import com.example.demo.entity.District;
import com.example.demo.service.DistrictService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/districts")
public class DistrictController {

    private final DistrictService districtService;

    public DistrictController(DistrictService districtService) {
        this.districtService = districtService;
    }

    @GetMapping
    public List<District> getAllDistricts() {
        return districtService.getAllDistricts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<District> getDistrictById(@PathVariable int id) {
        District district = districtService.getDistrictById(id);
        if (district != null) {
            return ResponseEntity.ok(district);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<District> createDistrict(@RequestBody District district) {
        return ResponseEntity.status(HttpStatus.CREATED).body(districtService.createDistrict(district));
    }

    @PutMapping("/{id}")
    public ResponseEntity<District> updateDistrict(@PathVariable int id, @RequestBody District updatedDistrict) {
        District district = districtService.updateDistrict(id, updatedDistrict);
        if (district != null) {
            return ResponseEntity.ok(district);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDistrict(@PathVariable int id) {
        if (districtService.deleteDistrict(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
