package com.example.demo.controller;

import com.example.demo.entity.TireShopService;
import com.example.demo.service.TireShopServiceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tire-shop-services")
public class TireShopServiceController {

    private final TireShopServiceService service;

    public TireShopServiceController(TireShopServiceService service) {
        this.service = service;
    }    @GetMapping
    public List<TireShopService> getAllServices() {
        return service.getAllServices();
    }

    @GetMapping("/shop/{shopId}")
    public List<TireShopService> getServicesByShop(@PathVariable int shopId) {
        return service.getServicesByShopId(shopId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TireShopService> getServiceById(@PathVariable int id) {
        TireShopService found = service.getServiceById(id);
        if (found != null) {
            return ResponseEntity.ok(found);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<TireShopService> createService(@RequestBody TireShopService newService) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createService(newService));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TireShopService> updateService(@PathVariable int id, @RequestBody TireShopService updated) {
        TireShopService result = service.updateService(id, updated);
        if (result != null) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteService(@PathVariable int id) {
        if (service.deleteService(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
