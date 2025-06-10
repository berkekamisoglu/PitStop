package com.example.demo.service;

import com.example.demo.entity.District;
import com.example.demo.repository.DistrictRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DistrictService {

    private final DistrictRepository districtRepository;

    public DistrictService(DistrictRepository districtRepository) {
        this.districtRepository = districtRepository;
    }

    @Transactional(readOnly = true)
    public List<District> getAllDistricts() {
        return districtRepository.findAll();
    }

    @Transactional(readOnly = true)
    public District getDistrictById(int id) {
        return districtRepository.findById(id).orElse(null);
    }

    @Transactional
    public District createDistrict(District district) {
        return districtRepository.save(district);
    }

    @Transactional
    public District updateDistrict(int id, District updatedDistrict) {
        District existingDistrict = districtRepository.findById(id).orElse(null);
        if (existingDistrict != null) {
            existingDistrict.setName(updatedDistrict.getName());
            existingDistrict.setCity(updatedDistrict.getCity());
            return districtRepository.save(existingDistrict);
        }
        return null;
    }

    @Transactional
    public boolean deleteDistrict(int id) {
        if (districtRepository.existsById(id)) {
            districtRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
