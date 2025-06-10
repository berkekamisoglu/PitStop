package com.example.demo.service;

import com.example.demo.entity.VehicleType;
import com.example.demo.repository.VehicleTypeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class VehicleTypeService {

    private final VehicleTypeRepository vehicleTypeRepository;

    public VehicleTypeService(VehicleTypeRepository vehicleTypeRepository) {
        this.vehicleTypeRepository = vehicleTypeRepository;
    }

    @Transactional(readOnly = true)
    public List<VehicleType> getAllVehicleTypes() {
        return vehicleTypeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public VehicleType getVehicleTypeById(int id) {
        return vehicleTypeRepository.findById(id).orElse(null);
    }

    @Transactional
    public VehicleType createVehicleType(VehicleType vehicleType) {
        return vehicleTypeRepository.save(vehicleType);
    }

    @Transactional
    public VehicleType updateVehicleType(int id, VehicleType updated) {
        VehicleType existing = vehicleTypeRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setTypeName(updated.getTypeName());
            return vehicleTypeRepository.save(existing);
        }
        return null;
    }

    @Transactional
    public boolean deleteVehicleType(int id) {
        if (vehicleTypeRepository.existsById(id)) {
            vehicleTypeRepository.deleteById(id);
            return true;
        }
        return false;
    }
} 