package com.example.demo.service;

import com.example.demo.entity.TirePrice;
import com.example.demo.repository.TirePriceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TirePriceService {

    private final TirePriceRepository tirePriceRepository;

    public TirePriceService(TirePriceRepository tirePriceRepository) {
        this.tirePriceRepository = tirePriceRepository;
    }

    @Transactional(readOnly = true)
    public List<TirePrice> getAllPrices() {
        return tirePriceRepository.findAll();
    }

    @Transactional(readOnly = true)
    public TirePrice getById(int id) {
        return tirePriceRepository.findById(id).orElse(null);
    }

    @Transactional
    public TirePrice create(TirePrice tirePrice) {
        return tirePriceRepository.save(tirePrice);
    }

    @Transactional
    public TirePrice update(int id, TirePrice updated) {
        TirePrice existing = tirePriceRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setPrice(updated.getPrice());
            existing.setTire(updated.getTire());
            existing.setTireShop(updated.getTireShop());
            return tirePriceRepository.save(existing);
        }
        return null;
    }

    @Transactional
    public boolean delete(int id) {
        if (tirePriceRepository.existsById(id)) {
            tirePriceRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
