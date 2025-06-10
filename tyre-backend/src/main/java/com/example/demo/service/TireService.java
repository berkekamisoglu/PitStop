package com.example.demo.service;

import com.example.demo.entity.Tire;
import com.example.demo.entity.TireSize;
import com.example.demo.repository.TireRepository;
import com.example.demo.repository.TireSizeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;



@Service
public class TireService {

    private final TireRepository tireRepository;
    private final TireSizeRepository tireSizeRepository;

    public TireService(TireRepository tireRepository, TireSizeRepository tireSizeRepository) {
        this.tireRepository = tireRepository;
        this.tireSizeRepository = tireSizeRepository;
    }

    @Transactional(readOnly = true)
    public List<Tire> getAllTires() {
        return tireRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Tire getTireById(int id) {
        return tireRepository.findById(id).orElse(null);
    }    @Transactional
    public Tire createTire(Tire tire) {
        // Check if TireSize exists by size, if not create it
        if (tire.getTireSize() != null && tire.getTireSize().getId() == 0) {
            String sizeValue = tire.getTireSize().getSize();
            
            // Find existing TireSize by size value
            TireSize existingSize = tireSizeRepository.findBySize(sizeValue).orElse(null);
            
            if (existingSize != null) {
                // Use existing TireSize
                tire.setTireSize(existingSize);
            } else {
                // Create new TireSize
                TireSize newSize = new TireSize();
                newSize.setSize(sizeValue);
                TireSize savedSize = tireSizeRepository.save(newSize);
                tire.setTireSize(savedSize);
            }
        }
        
        return tireRepository.save(tire);
    }

    @Transactional
    public Tire updateTire(int id, Tire updated) {
        Tire existing = tireRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setBrand(updated.getBrand());
            existing.setModel(updated.getModel());
            existing.setPrice(updated.getPrice()); // ← EKLENDİ
            existing.setTireSize(updated.getTireSize());
            return tireRepository.save(existing);
        }
        return null;
    }

    @Transactional
    public boolean deleteTire(int id) {
        if (tireRepository.existsById(id)) {
            tireRepository.deleteById(id);
            return true;
        }
        return false;
    }

    
}

