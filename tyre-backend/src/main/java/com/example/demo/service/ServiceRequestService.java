package com.example.demo.service;

import com.example.demo.entity.RequestStatus;
import com.example.demo.entity.ServiceRequest;
import com.example.demo.entity.TireShop;
import com.example.demo.entity.User;
import com.example.demo.repository.ServiceRequestRepository;
import com.example.demo.repository.TireShopRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

// DESIGN PATTERN: Service Layer Pattern
// Acil yardım talebi iş mantığını yönetir
// Coğrafi hesaplamalar ve durum yönetimi sağlar
@Service
public class ServiceRequestService {

    private final ServiceRequestRepository serviceRequestRepository;
    private final TireShopRepository tireShopRepository;
    private final UserRepository userRepository;

    public ServiceRequestService(ServiceRequestRepository serviceRequestRepository, TireShopRepository tireShopRepository, UserRepository userRepository) {
        this.serviceRequestRepository = serviceRequestRepository;
        this.tireShopRepository = tireShopRepository;
        this.userRepository = userRepository;
    }

    // Yeni yardım isteği oluştur
    @Transactional
    public ServiceRequest createServiceRequest(ServiceRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("ServiceRequestService - Authentication: " + authentication);
        
        if (authentication != null) {
            Object principal = authentication.getPrincipal();
            System.out.println("ServiceRequestService - Principal: " + principal);
            System.out.println("ServiceRequestService - Principal class: " + (principal != null ? principal.getClass().getName() : "null"));
            
            if (principal instanceof User) {
                User user = (User) principal;
                System.out.println("ServiceRequestService - Setting user: " + user.getEmail());
                request.setUser(user);
            } else {
                System.out.println("ServiceRequestService - Principal is not User instance");
                throw new RuntimeException("Only users can create service requests");
            }
        } else {
            System.out.println("ServiceRequestService - No authentication found");
            throw new RuntimeException("Authentication required to create service requests");
        }
        
        request.setStatus(RequestStatus.PENDING);
        request.setCreatedAt(Timestamp.valueOf(LocalDateTime.now()));
        System.out.println("ServiceRequestService - Saving request with user: " + request.getUser().getEmail());
        return serviceRequestRepository.save(request);
    }

    // Tüm istekleri getir
    @Transactional(readOnly = true)
    public List<ServiceRequest> getAllRequests() {
        return serviceRequestRepository.findAll();
    }

    // Sadece bekleyen (PENDING) istekleri getir
    @Transactional(readOnly = true)
    public List<ServiceRequest> getPendingRequests() {
        return serviceRequestRepository.findByStatus(RequestStatus.PENDING);
    }

    // İsteği kabul et (status'u ACCEPTED yap)
    @Transactional
    public ServiceRequest acceptRequest(int requestId) {
        ServiceRequest request = serviceRequestRepository.findById(requestId).orElse(null);
        if (request != null && request.getStatus() == RequestStatus.PENDING) {
            request.setStatus(RequestStatus.ACCEPTED);
            return serviceRequestRepository.save(request);
        }
        return null;
    }

    // İsteği tamamla (status'u COMPLETED yap)
    @Transactional
    public ServiceRequest completeRequest(int requestId) {
        ServiceRequest request = serviceRequestRepository.findById(requestId).orElse(null);
        if (request != null && request.getStatus() == RequestStatus.ACCEPTED) {
            request.setStatus(RequestStatus.COMPLETED);
            return serviceRequestRepository.save(request);
        }
        return null;
    }

    // Shop için yakındaki acil talepleri getir
    @Transactional(readOnly = true)
    public List<ServiceRequest> getNearbyRequests(int shopId, double radiusKm) {
        TireShop shop = tireShopRepository.findById(shopId).orElse(null);
        if (shop == null || shop.getLatitude() == null || shop.getLongitude() == null) {
            return List.of(); // Boş liste döndür
        }

        List<ServiceRequest> pendingRequests = serviceRequestRepository.findByStatus(RequestStatus.PENDING);
        
        return pendingRequests.stream()
            .filter(request -> {
                double distance = calculateDistance(
                    shop.getLatitude(), shop.getLongitude(),
                    request.getLatitude(), request.getLongitude()
                );
                return distance <= radiusKm;
            })
            .collect(Collectors.toList());
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of Earth in km
        
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c; // Distance in km
    }
}
