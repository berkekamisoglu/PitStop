package com.example.demo.service;

import com.example.demo.entity.TireStock;
import com.example.demo.repository.TireStockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TireStockService {

    private final TireStockRepository tireStockRepository;

    public TireStockService(TireStockRepository tireStockRepository) {
        this.tireStockRepository = tireStockRepository;
    }

    @Transactional(readOnly = true)
    public List<TireStock> getAllStocks() {
        return tireStockRepository.findAll();
    }    @Transactional(readOnly = true)
    public TireStock getStockById(int id) {
        return tireStockRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<TireStock> getStockByShopId(int shopId) {
        return tireStockRepository.findByTireShopId(shopId);
    }

    @Transactional
    public TireStock createStock(TireStock stock) {
        return tireStockRepository.save(stock);
    }

    @Transactional
    public TireStock updateStock(int id, TireStock updated) {
        TireStock existing = tireStockRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setTire(updated.getTire());
            existing.setTireShop(updated.getTireShop());
            existing.setStockQuantity(updated.getStockQuantity());
            return tireStockRepository.save(existing);
        }
        return null;
    }

    @Transactional
    public boolean deleteStock(int id) {
        if (tireStockRepository.existsById(id)) {
            tireStockRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
