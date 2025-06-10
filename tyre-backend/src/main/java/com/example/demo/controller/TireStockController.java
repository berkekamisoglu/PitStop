package com.example.demo.controller;

import com.example.demo.entity.TireStock;
import com.example.demo.service.TireStockService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tire-stock")
public class TireStockController {

    private final TireStockService tireStockService;

    public TireStockController(TireStockService tireStockService) {
        this.tireStockService = tireStockService;
    }    @GetMapping
    public List<TireStock> getAllStocks() {
        return tireStockService.getAllStocks();
    }

    @GetMapping("/shop/{shopId}")
    public List<TireStock> getStockByShop(@PathVariable int shopId) {
        return tireStockService.getStockByShopId(shopId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TireStock> getStockById(@PathVariable int id) {
        TireStock stock = tireStockService.getStockById(id);
        if (stock != null) {
            return ResponseEntity.ok(stock);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<TireStock> createStock(@RequestBody TireStock stock) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tireStockService.createStock(stock));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TireStock> updateStock(@PathVariable int id, @RequestBody TireStock updated) {
        TireStock stock = tireStockService.updateStock(id, updated);
        if (stock != null) {
            return ResponseEntity.ok(stock);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable int id) {
        if (tireStockService.deleteStock(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
