package com.example.demo.service;

import com.example.demo.entity.Appointment;
import com.example.demo.entity.User;
import com.example.demo.entity.TireShop;
import com.example.demo.entity.TireShopService;
import com.example.demo.entity.UserVehicle;
import com.example.demo.entity.AppointmentStatus;
import com.example.demo.dto.AppointmentCreateRequest;
import com.example.demo.dto.AppointmentResponse;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.TireShopRepository;
import com.example.demo.repository.TireShopServiceRepository;
import com.example.demo.repository.UserVehicleRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AppointmentService {    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final TireShopRepository tireShopRepository;
    private final TireShopServiceRepository tireShopServiceRepository;
    private final UserVehicleRepository userVehicleRepository;    public AppointmentService(AppointmentRepository appointmentRepository, 
                            UserRepository userRepository,
                            TireShopRepository tireShopRepository,
                            TireShopServiceRepository tireShopServiceRepository,
                            UserVehicleRepository userVehicleRepository) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.tireShopRepository = tireShopRepository;
        this.tireShopServiceRepository = tireShopServiceRepository;
        this.userVehicleRepository = userVehicleRepository;
    }

  
    @Transactional(readOnly = true)
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }


    @Transactional(readOnly = true)
    public Appointment getAppointmentById(int id) {
        return appointmentRepository.findById(id).orElse(null);
    }  
    @Transactional
    public Appointment createAppointment(AppointmentCreateRequest request) {
        // Get authenticated user from security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("AppointmentService - Authentication: " + authentication);
        
        if (authentication == null) {
            System.out.println("AppointmentService - No authentication found");
            throw new RuntimeException("Authentication required to create appointments");
        }
        
        Object principal = authentication.getPrincipal();
        System.out.println("AppointmentService - Principal: " + principal);
        System.out.println("AppointmentService - Principal class: " + (principal != null ? principal.getClass().getName() : "null"));
        
        if (!(principal instanceof User)) {
            System.out.println("AppointmentService - Principal is not User instance");
            throw new RuntimeException("Only users can create appointments");
        }
        
        User user = (User) principal;
        System.out.println("AppointmentService - Setting user: " + user.getEmail());
        
        // Find TireShop
        TireShop tireShop = tireShopRepository.findById(request.getTireShopId())
                .orElseThrow(() -> new RuntimeException("TireShop not found with id: " + request.getTireShopId()));
          // Find TireShopService
        TireShopService service = tireShopServiceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + request.getServiceId()));
        
        // Find UserVehicle (only if vehicleId is provided)
        UserVehicle vehicle = null;
        if (request.getVehicleId() != null) {
            vehicle = userVehicleRepository.findById(request.getVehicleId())
                    .filter(v -> v.getUser().getId().equals(user.getId()))
                    .orElseThrow(() -> new RuntimeException("Vehicle not found or access denied with id: " + request.getVehicleId()));
        }
        
        // Create appointment
        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setTireShop(tireShop);
        appointment.setService(service);
        appointment.setVehicle(vehicle);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setStatus(request.getStatus() != null ? request.getStatus() : AppointmentStatus.PENDING);
        
        System.out.println("AppointmentService - Saving appointment for user: " + user.getEmail() + 
                          " at shop: " + tireShop.getShopName());
        
        return appointmentRepository.save(appointment);
    }

    @Transactional
    public Appointment createAppointment(Appointment appointment) {
        // Get authenticated user from security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("AppointmentService - Authentication: " + authentication);
        
        if (authentication != null) {
            Object principal = authentication.getPrincipal();
            System.out.println("AppointmentService - Principal: " + principal);
            System.out.println("AppointmentService - Principal class: " + (principal != null ? principal.getClass().getName() : "null"));
            
            if (principal instanceof User) {
                User user = (User) principal;
                appointment.setUser(user);
                System.out.println("AppointmentService - Setting user: " + user.getEmail());
            } else {
                System.out.println("AppointmentService - Principal is not User instance");
                throw new RuntimeException("Only users can create appointments");
            }
        } else {
            System.out.println("AppointmentService - No authentication found");
            throw new RuntimeException("Authentication required to create appointments");
        }
        
        return appointmentRepository.save(appointment);
    }

  
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public Appointment updateAppointment(int id, Appointment updatedAppointment) {
        Appointment existingAppointment = appointmentRepository.findById(id).orElse(null);
        if (existingAppointment != null) {
            existingAppointment.setAppointmentDate(updatedAppointment.getAppointmentDate());
            existingAppointment.setUser(updatedAppointment.getUser());
            existingAppointment.setTireShop(updatedAppointment.getTireShop());
            existingAppointment.setService(updatedAppointment.getService());
            existingAppointment.setStatus(updatedAppointment.getStatus());
            return appointmentRepository.save(existingAppointment);
        }
        return null;    }    @Transactional(readOnly = true)
    public List<Appointment> getAppointmentsByShopId(int shopId) {
        return appointmentRepository.findByTireShopId(shopId);
    }    @Transactional
    public Appointment updateAppointmentStatus(int id, String status) {
        // Get authenticated principal from security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("Authentication required");
        }
        
        Object principal = authentication.getPrincipal();
        Appointment appointment = appointmentRepository.findById(id).orElse(null);
        
        if (appointment != null) {
            // Check if user has permission to update this appointment
            boolean hasPermission = false;
            
            // Customer can update their own appointments
            if (principal instanceof User) {
                User currentUser = (User) principal;
                if (appointment.getUser().getId().equals(currentUser.getId())) {
                    hasPermission = true;
                }
            }
            
            // Shop owner can update appointments for their shop
            if (principal instanceof TireShop) {
                TireShop currentShop = (TireShop) principal;
                if (appointment.getTireShop() != null && 
                    appointment.getTireShop().getId() == currentShop.getId()) {
                    hasPermission = true;
                }
            }
            
            if (!hasPermission) {
                throw new RuntimeException("Unauthorized to update this appointment");
            }
            
            try {
                appointment.setStatus(com.example.demo.entity.AppointmentStatus.valueOf(status.toUpperCase()));
                return appointmentRepository.save(appointment);
            } catch (IllegalArgumentException e) {
                return null; // Invalid status
            }
        }
        return null;
    }@Transactional
    public boolean deleteAppointment(int id) {
        if (appointmentRepository.existsById(id)) {
            appointmentRepository.deleteById(id);
            return true;
        }
        return false;
    }    // Methods to get appointments as DTOs
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAllAppointmentsAsDTO() {
        return appointmentRepository.findAll().stream()
                .map(this::toAppointmentResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AppointmentResponse getAppointmentByIdAsDTO(int id) {
        Appointment appointment = appointmentRepository.findById(id).orElse(null);
        return appointment != null ? toAppointmentResponse(appointment) : null;
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsByShopIdAsDTO(int shopId) {
        return getAppointmentsByShopId(shopId).stream()
                .map(this::toAppointmentResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointmentsForAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null) {
            Object principal = authentication.getPrincipal();
            
            if (principal instanceof User) {
                // Customer: return only their appointments
                User user = (User) principal;
                List<Appointment> appointments = appointmentRepository.findByUserId(user.getId());
                return appointments.stream()
                    .map(this::toAppointmentResponse)
                    .collect(Collectors.toList());
            } else if (principal instanceof TireShop) {
                // Shop: return only their appointments
                TireShop shop = (TireShop) principal;
                List<Appointment> appointments = appointmentRepository.findByTireShopId(shop.getId());
                return appointments.stream()
                    .map(this::toAppointmentResponse)
                    .collect(Collectors.toList());
            }
        }
        
        // If authentication fails, return empty list
        return new ArrayList<>();
    }

    @Transactional(readOnly = true)
    public boolean hasPermissionToViewAppointment(int appointmentId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null) {
            Object principal = authentication.getPrincipal();
            Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
            
            if (appointmentOpt.isPresent()) {
                Appointment appointment = appointmentOpt.get();
                
                if (principal instanceof User) {
                    // Customer can only view their own appointments
                    User user = (User) principal;
                    return appointment.getUser().getId().equals(user.getId());
                } else if (principal instanceof TireShop) {
                    // Shop can only view appointments at their shop
                    TireShop shop = (TireShop) principal;
                    return appointment.getTireShop().getId() == shop.getId();
                }
            }
        }
          return false;
    }

    // Helper method to find appointments by user ID
    @Transactional(readOnly = true)
    public List<Appointment> findByUserId(Integer userId) {
        return appointmentRepository.findByUserId(userId);
    }

    // Helper method to map Appointment entity to AppointmentResponse DTO
    private AppointmentResponse toAppointmentResponse(Appointment appointment) {
        AppointmentResponse response = new AppointmentResponse();
        
        response.setId(appointment.getId());
        
        // Format date and time
        if (appointment.getAppointmentDate() != null) {
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
            response.setDate(appointment.getAppointmentDate().format(dateFormatter));
            response.setTime(appointment.getAppointmentDate().format(timeFormatter));
        }
        
        // Shop information
        if (appointment.getTireShop() != null) {
            response.setShopName(appointment.getTireShop().getShopName());
            response.setAddress(appointment.getTireShop().getAddress());
        }
        
        // Service information
        if (appointment.getService() != null) {
            AppointmentResponse.ServiceDto serviceDto = new AppointmentResponse.ServiceDto(
                appointment.getService().getId(),
                appointment.getService().getServiceName(),
                appointment.getService().getPrice()
            );
            response.setService(serviceDto);
        }
        
        // Vehicle information
        if (appointment.getVehicle() != null) {
            UserVehicle vehicle = appointment.getVehicle();
            response.setVehicle(vehicle.getBrand() + " " + vehicle.getModel() + " (" + vehicle.getLicensePlate() + ")");
        } else {
            response.setVehicle("Araç bilgisi mevcut değil");
        }
        
        // Customer information
        if (appointment.getUser() != null) {
            response.setCustomerName(appointment.getUser().getName());
            response.setCustomerPhone(appointment.getUser().getPhone());
        }
        
        response.setStatus(appointment.getStatus());
        
        return response;
    }
}
