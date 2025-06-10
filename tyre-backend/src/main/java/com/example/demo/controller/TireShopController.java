package com.example.demo.controller;

import com.example.demo.entity.TireShop;
import com.example.demo.service.TireShopService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// DESIGN PATTERN: MVC Pattern - Controller Layer
// TireShop CRUD operasyonlarını yönetir
// RESTful API endpoint'leri sağlar
@RestController
@RequestMapping("/api/tireshops")
public class TireShopController {

    private final TireShopService tireShopService;

    public TireShopController(TireShopService tireShopService) {
        this.tireShopService = tireShopService;
    }

    @GetMapping
    public List<TireShop> getAllTireShops(
            @RequestParam(required = false) Double latitude,
            @RequestParam(required = false) Double longitude,
            @RequestParam(required = false, defaultValue = "10.0") Double radiusKm
    ) {
        if (latitude != null && longitude != null) {
            return tireShopService.getNearbyTireShops(latitude, longitude, radiusKm);
        }
        return tireShopService.getAllTireShops();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TireShop> getTireShopById(@PathVariable int id) {
        return tireShopService.findById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new RuntimeException("Lastikçi bulunamadı"));
    }

    @PostMapping
    public ResponseEntity<TireShop> createTireShop(@RequestBody TireShop tireShop) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tireShopService.createTireShop(tireShop));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TireShop> updateTireShop(@PathVariable int id, @RequestBody TireShop updatedTireShop) {
        TireShop tireShop = tireShopService.updateTireShop(id, updatedTireShop);
        if (tireShop != null) {
            return ResponseEntity.ok(tireShop);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/coordinates")
    public ResponseEntity<TireShop> updateShopCoordinates(
            @PathVariable int id,
            @RequestParam Double latitude,
            @RequestParam Double longitude) {
        return tireShopService.findById(id)
                .map(shop -> {
                    shop.setLatitude(latitude);
                    shop.setLongitude(longitude);
                    return ResponseEntity.ok(tireShopService.updateTireShop(id, shop));
                })
                .orElseThrow(() -> new RuntimeException("Lastikçi bulunamadı"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTireShop(@PathVariable int id) {
        if (tireShopService.deleteTireShop(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
