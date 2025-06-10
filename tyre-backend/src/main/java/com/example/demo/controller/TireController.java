package com.example.demo.controller;

import com.example.demo.entity.Tire;
import com.example.demo.service.TireService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tires")
public class TireController {

    private final TireService tireService;

    public TireController(TireService tireService) {
        this.tireService = tireService;
    }

    @GetMapping
    public List<Tire> getAllTires() {
        return tireService.getAllTires();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tire> getTireById(@PathVariable int id) {
        Tire tire = tireService.getTireById(id);
        if (tire != null) {
            return ResponseEntity.ok(tire);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Tire> createTire(@RequestBody Tire newTire) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tireService.createTire(newTire));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tire> updateTire(@PathVariable int id, @RequestBody Tire updatedTire) {
        Tire result = tireService.updateTire(id, updatedTire);
        if (result != null) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTire(@PathVariable int id) {
        if (tireService.deleteTire(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
