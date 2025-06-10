package com.example.demo.service;

import com.example.demo.entity.TireShop;
import com.example.demo.entity.ServiceRequest;
import com.example.demo.repository.TireShopRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

// DESIGN PATTERN: Service Layer Pattern + Strategy Pattern
// Acil durum alert sistemi - yakındaki dükkanları bulur ve bildirim gönderir
// Farklı bildirim stratejileri için genişletilebilir
@Service
public class EmergencyAlertService {

    private final TireShopRepository tireShopRepository;

    public EmergencyAlertService(TireShopRepository tireShopRepository) {
        this.tireShopRepository = tireShopRepository;
    }

    public List<TireShop> findNearbyShops(double userLatitude, double userLongitude, double radiusKm) {
        List<TireShop> allShops = tireShopRepository.findAll();
        
        return allShops.stream()
            .filter(shop -> shop.getLatitude() != null && shop.getLongitude() != null)
            .filter(shop -> {
                double distance = calculateDistance(
                    userLatitude, userLongitude,
                    shop.getLatitude(), shop.getLongitude()
                );
                return distance <= radiusKm;
            })
            .collect(Collectors.toList());
    }

    public void sendEmergencyAlert(ServiceRequest serviceRequest) {
        List<TireShop> nearbyShops = findNearbyShops(
            serviceRequest.getLatitude(), 
            serviceRequest.getLongitude(), 
            15.0
        );

        System.out.println("🚨 EMERGENCY ALERT 🚨");
        System.out.println("Service Request ID: " + serviceRequest.getId());
        System.out.println("Title: " + serviceRequest.getTitle());
        System.out.println("Priority: " + serviceRequest.getPriority());
        System.out.println("Location: " + serviceRequest.getLatitude() + ", " + serviceRequest.getLongitude());
        System.out.println("Nearby shops to notify: " + nearbyShops.size());
        
        for (TireShop shop : nearbyShops) {
            double distance = calculateDistance(
                serviceRequest.getLatitude(), serviceRequest.getLongitude(),
                shop.getLatitude(), shop.getLongitude()
            );
            System.out.println("- " + shop.getShopName() + " (" + String.format("%.1f", distance) + " km away)");
        }
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }
} 