package com.example.demo.controller;

import com.example.demo.entity.ServiceRequest;
import com.example.demo.service.ServiceRequestService;
import com.example.demo.service.EmergencyAlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// DESIGN PATTERN: MVC Pattern - Controller Layer
// Acil yardım taleplerini yönetir
// Emergency alert servisini koordine eder
@RestController
@RequestMapping("/api/requests")
public class ServiceRequestController {

    private final ServiceRequestService serviceRequestService;
    private final EmergencyAlertService emergencyAlertService;

    public ServiceRequestController(ServiceRequestService serviceRequestService, EmergencyAlertService emergencyAlertService) {
        this.serviceRequestService = serviceRequestService;
        this.emergencyAlertService = emergencyAlertService;
    }

    // Yeni yardım isteği oluştur
    @PostMapping
    public ResponseEntity<ServiceRequest> createRequest(@RequestBody ServiceRequest request) {
        ServiceRequest createdRequest = serviceRequestService.createServiceRequest(request);
        
        // Acil durum alerti gönder
        emergencyAlertService.sendEmergencyAlert(createdRequest);
        
        return ResponseEntity.ok(createdRequest);
    }

    // Tüm istekleri getir
    @GetMapping
    public List<ServiceRequest> getAllRequests() {
        return serviceRequestService.getAllRequests();
    }

    // Bekleyen (PENDING) istekleri getir
    @GetMapping("/pending")
    public List<ServiceRequest> getPendingRequests() {
        return serviceRequestService.getPendingRequests();
    }

    // Yardım isteğini kabul et
    @PutMapping("/{id}/accept")
    public ResponseEntity<ServiceRequest> acceptRequest(@PathVariable int id) {
        ServiceRequest request = serviceRequestService.acceptRequest(id);
        if (request != null) {
            return ResponseEntity.ok(request);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Yardım isteğini tamamla
    @PutMapping("/{id}/complete")
    public ResponseEntity<ServiceRequest> completeRequest(@PathVariable int id) {
        ServiceRequest request = serviceRequestService.completeRequest(id);
        if (request != null) {
            return ResponseEntity.ok(request);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Shop için yakındaki acil talepleri getir
    @GetMapping("/nearby/{shopId}")
    public List<ServiceRequest> getNearbyRequests(@PathVariable int shopId) {
        return serviceRequestService.getNearbyRequests(shopId, 15.0); // 15 km radius
    }
}
