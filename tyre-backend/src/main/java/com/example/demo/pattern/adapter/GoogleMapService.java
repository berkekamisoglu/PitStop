package com.example.demo.pattern.adapter;

import org.springframework.stereotype.Service;

// DESIGN PATTERN: Adapter Pattern - Concrete Adapter
// Google Maps API'sini IMapService interface'ine adapte eder
@Service
public class GoogleMapService implements IMapService {

    @Override
    public String createMarker(double latitude, double longitude, String description) {
        // Burada normalde Google Maps API çağrısı yapılırdı.
        System.out.println("Google Maps'te marker oluşturuldu: (" + latitude + ", " + longitude + ") - " + description);
        return "google-marker-id-123"; // Simülasyon ID
    }
}
