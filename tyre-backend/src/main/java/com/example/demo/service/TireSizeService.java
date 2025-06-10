package com.example.demo.service;

import com.example.demo.entity.TireSize;
import com.example.demo.repository.TireSizeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TireSizeService {

    private final TireSizeRepository tireSizeRepository;

    public TireSizeService(TireSizeRepository tireSizeRepository) {
        this.tireSizeRepository = tireSizeRepository;
    }

    @Transactional(readOnly = true)
    public List<TireSize> getAllSizes() {
        return tireSizeRepository.findAll();
    }

    @Transactional(readOnly = true)
    public TireSize getSizeById(int id) {
        return tireSizeRepository.findById(id).orElse(null);
    }

    @Transactional
    public TireSize createSize(TireSize size) {
        return tireSizeRepository.save(size);
    }

    @Transactional
    public TireSize updateSize(int id, TireSize updated) {
        TireSize existing = tireSizeRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setSize(updated.getSize());
            return tireSizeRepository.save(existing);
        }
        return null;
    }

    @Transactional
    public boolean deleteSize(int id) {
        if (tireSizeRepository.existsById(id)) {
            tireSizeRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
