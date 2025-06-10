package com.example.demo.repository;

import com.example.demo.entity.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// DESIGN PATTERN: Repository Pattern
// ServiceRequest entity'si için veri erişim operasyonları
// Custom query method ile status'e göre filtreleme
@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Integer> {
    List<ServiceRequest> findByStatus(com.example.demo.entity.RequestStatus status);
}
