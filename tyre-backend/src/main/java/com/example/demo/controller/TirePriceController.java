package com.example.demo.controller;

import com.example.demo.entity.TirePrice;
import com.example.demo.service.TirePriceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tire-prices")
public class TirePriceController {

    private final TirePriceService tirePriceService;

    public TirePriceController(TirePriceService tirePriceService) {
        this.tirePriceService = tirePriceService;
    }

    @GetMapping
    public List<TirePrice> getAll() {
        return tirePriceService.getAllPrices();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TirePrice> getById(@PathVariable int id) {
        TirePrice price = tirePriceService.getById(id);
        return price != null ? ResponseEntity.ok(price) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<TirePrice> create(@RequestBody TirePrice price) {
        return ResponseEntity.ok(tirePriceService.create(price));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TirePrice> update(@PathVariable int id, @RequestBody TirePrice updated) {
        TirePrice result = tirePriceService.update(id, updated);
        return result != null ? ResponseEntity.ok(result) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        return tirePriceService.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
