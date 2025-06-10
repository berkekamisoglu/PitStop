package com.example.demo.controller;

import com.example.demo.entity.TireSize;
import com.example.demo.service.TireSizeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tire-sizes")
public class TireSizeController {

    private final TireSizeService tireSizeService;

    public TireSizeController(TireSizeService tireSizeService) {
        this.tireSizeService = tireSizeService;
    }

    @GetMapping
    public List<TireSize> getAllSizes() {
        return tireSizeService.getAllSizes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TireSize> getSizeById(@PathVariable int id) {
        TireSize size = tireSizeService.getSizeById(id);
        if (size != null) {
            return ResponseEntity.ok(size);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<TireSize> createSize(@RequestBody TireSize size) {
        return ResponseEntity.status(HttpStatus.CREATED).body(tireSizeService.createSize(size));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TireSize> updateSize(@PathVariable int id, @RequestBody TireSize updated) {
        TireSize size = tireSizeService.updateSize(id, updated);
        if (size != null) {
            return ResponseEntity.ok(size);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSize(@PathVariable int id) {
        if (tireSizeService.deleteSize(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
