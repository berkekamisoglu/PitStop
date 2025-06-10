package com.example.demo.service;

import com.example.demo.entity.UserVehicle;
import com.example.demo.entity.User;
import com.example.demo.repository.UserVehicleRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;
import java.util.List;

@Service
public class UserVehicleService {

    private final UserVehicleRepository userVehicleRepository;

    public UserVehicleService(UserVehicleRepository userVehicleRepository) {
        this.userVehicleRepository = userVehicleRepository;
    }

    @Transactional(readOnly = true)
    public List<UserVehicle> getAllVehicles() {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userVehicleRepository.findByUserId(currentUser.getId());
    }

    @Transactional(readOnly = true)
    public UserVehicle getVehicleById(int id) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return userVehicleRepository.findById(id)
            .filter(vehicle -> vehicle.getUser().getId().equals(currentUser.getId()))
            .orElse(null);
    }

    @Transactional
    public UserVehicle createVehicle(UserVehicle vehicle) {
        if (vehicle == null) {
            throw new IllegalArgumentException("Vehicle cannot be null");
        }

        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        vehicle.setUser(currentUser);

        // Ensure required fields are set
        if (vehicle.getLicensePlate() == null || vehicle.getLicensePlate().trim().isEmpty()) {
            throw new IllegalArgumentException("License plate is required");
        }
        if (vehicle.getBrand() == null || vehicle.getBrand().trim().isEmpty()) {
            throw new IllegalArgumentException("Brand is required");
        }
        if (vehicle.getModel() == null || vehicle.getModel().trim().isEmpty()) {
            throw new IllegalArgumentException("Model is required");
        }
        if (vehicle.getVehicleType() == null) {
            throw new IllegalArgumentException("Vehicle type is required");
        }
        if (vehicle.getTireSize() == null) {
            throw new IllegalArgumentException("Tire size is required");
        }

        return userVehicleRepository.save(vehicle);
    }

    @Transactional
    public UserVehicle updateVehicle(int id, UserVehicle updated) {
        if (updated == null) {
            throw new IllegalArgumentException("Updated vehicle cannot be null");
        }

        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserVehicle existing = userVehicleRepository.findById(id)
            .filter(vehicle -> vehicle.getUser().getId().equals(currentUser.getId()))
            .orElseThrow(() -> new IllegalArgumentException("Vehicle not found or access denied"));

        // Update fields if provided, otherwise keep existing values
        if (updated.getLicensePlate() != null && !updated.getLicensePlate().trim().isEmpty()) {
            existing.setLicensePlate(updated.getLicensePlate().trim());
        }
        if (updated.getBrand() != null && !updated.getBrand().trim().isEmpty()) {
            existing.setBrand(updated.getBrand().trim());
        }
        if (updated.getModel() != null && !updated.getModel().trim().isEmpty()) {
            existing.setModel(updated.getModel().trim());
        }
        if (updated.getVehicleType() != null) {
            existing.setVehicleType(updated.getVehicleType());
        }
        if (updated.getTireSize() != null) {
            existing.setTireSize(updated.getTireSize());
        }

        return userVehicleRepository.save(existing);
    }

    @Transactional
    public boolean deleteVehicle(int id) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<UserVehicle> vehicle = userVehicleRepository.findById(id)
            .filter(v -> v.getUser().getId().equals(currentUser.getId()));

        if (vehicle.isPresent()) {
            userVehicleRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
