package com.example.demo.service;

import com.example.demo.entity.TireShopService;
import com.example.demo.repository.TireShopServiceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TireShopServiceService {

    private final TireShopServiceRepository serviceRepository;

    public TireShopServiceService(TireShopServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @Transactional(readOnly = true)
    public List<TireShopService> getAllServices() {
        return serviceRepository.findAll();
    }    @Transactional(readOnly = true)
    public TireShopService getServiceById(int id) {
        return serviceRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<TireShopService> getServicesByShopId(int shopId) {
        return serviceRepository.findByTireShopId(shopId);
    }

    @Transactional
    public TireShopService createService(TireShopService service) {
        return serviceRepository.save(service);
    }

    @Transactional
    public TireShopService updateService(int id, TireShopService updated) {
        TireShopService existing = serviceRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setServiceName(updated.getServiceName());
            existing.setTireShop(updated.getTireShop());
            return serviceRepository.save(existing);
        }
        return null;
    }

    @Transactional
    public boolean deleteService(int id) {
        if (serviceRepository.existsById(id)) {
            serviceRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
