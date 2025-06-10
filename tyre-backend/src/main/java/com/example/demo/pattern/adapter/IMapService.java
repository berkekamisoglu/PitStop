package com.example.demo.pattern.adapter;

// DESIGN PATTERN: Adapter Pattern - Target Interface
// Harita servisleri için standart arayüz tanımlar
public interface IMapService {
    String createMarker(double latitude, double longitude, String description);
}
