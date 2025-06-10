package com.example.demo.controller;

import com.example.demo.entity.UserTire;
import com.example.demo.service.UserTireService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-tires")
public class UserTireController {

    private final UserTireService userTireService;

    public UserTireController(UserTireService userTireService) {
        this.userTireService = userTireService;
    }

    @GetMapping
    public List<UserTire> getAllUserTires() {
        return userTireService.getAllUserTires();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserTire> getUserTireById(@PathVariable int id) {
        UserTire userTire = userTireService.getUserTireById(id);
        if (userTire != null) {
            return ResponseEntity.ok(userTire);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<UserTire> createUserTire(@RequestBody UserTire userTire) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userTireService.createUserTire(userTire));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserTire> updateUserTire(@PathVariable int id, @RequestBody UserTire updatedUserTire) {
        UserTire result = userTireService.updateUserTire(id, updatedUserTire);
        if (result != null) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserTire(@PathVariable int id) {
        if (userTireService.deleteUserTire(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
