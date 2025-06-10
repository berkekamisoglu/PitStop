package com.example.demo.controller;

import com.example.demo.entity.Appointment;
import com.example.demo.dto.AppointmentCreateRequest;
import com.example.demo.dto.AppointmentResponse;
import com.example.demo.service.AppointmentService;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }    @GetMapping
    public List<AppointmentResponse> getAllAppointments() {
        // This endpoint should return only appointments for the authenticated user/shop
        return appointmentService.getAppointmentsForAuthenticatedUser();
    }

    @GetMapping("/shop/{shopId}")
    public List<AppointmentResponse> getAppointmentsByShop(@PathVariable int shopId) {
        return appointmentService.getAppointmentsByShopIdAsDTO(shopId);
    }
    @GetMapping("/{id}")
    public ResponseEntity<AppointmentResponse> getAppointmentById(@PathVariable int id) {
        AppointmentResponse appointment = appointmentService.getAppointmentByIdAsDTO(id);
        if (appointment != null) {
            // Verify the user has permission to view this appointment
            if (appointmentService.hasPermissionToViewAppointment(id)) {
                return ResponseEntity.ok(appointment);
            } else {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        return ResponseEntity.notFound().build();
    }@PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody AppointmentCreateRequest request) {
        System.out.println("AppointmentController - Received request: " + request.getAppointmentDate() + 
                          ", TireShopId: " + request.getTireShopId() + 
                          ", ServiceId: " + request.getServiceId());
        
        Appointment appointment = appointmentService.createAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(appointment);
    }

     @PutMapping("/{id}")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable int id, @RequestBody Appointment updatedAppointment) {
        Appointment appointment = appointmentService.updateAppointment(id, updatedAppointment);
        if (appointment != null) {
            return ResponseEntity.ok(appointment);
        }
        return ResponseEntity.notFound().build();
    }    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable int id, @RequestBody java.util.Map<String, String> statusUpdate) {
        try {
            Appointment appointment = appointmentService.updateAppointmentStatus(id, statusUpdate.get("status"));
            if (appointment != null) {
                return ResponseEntity.ok(appointment);
            }
            return ResponseEntity.notFound().build();
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Unauthorized")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bu randevuyu güncelleme yetkiniz yok.");
            } else if (e.getMessage().contains("not authenticated")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Oturum açmanız gerekiyor.");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Randevu durumu güncellenirken hata oluştu.");
        }
    }

    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable int id) {
        if (appointmentService.deleteAppointment(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    
    @ExceptionHandler(OptimisticLockingFailureException.class)
    public ResponseEntity<String> handleOptimisticLockingFailure(OptimisticLockingFailureException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("Bu randevu başka biri tarafından değiştirildi. Lütfen tekrar deneyin.");
    }
}
