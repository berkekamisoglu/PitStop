package com.example.demo.service;

import com.example.demo.entity.TireShop;
import com.example.demo.repository.TireShopRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

// DESIGN PATTERN: Service Layer Pattern
// İş mantığını encapsulate eder ve controller ile repository arasında köprü görevi görür
// Transaction yönetimi sağlar
@Service
public class TireShopService {

    private final TireShopRepository tireShopRepository;

    public TireShopService(TireShopRepository tireShopRepository) {
        this.tireShopRepository = tireShopRepository;
    }

    @Transactional(readOnly = true)
    public List<TireShop> getAllTireShops() {
        return tireShopRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<TireShop> getNearbyTireShops(double latitude, double longitude, double radiusKm) {
        List<TireShop> allShops = tireShopRepository.findAll();
        return allShops.stream()
                .filter(shop -> shop.getLatitude() != null && shop.getLongitude() != null)
                .filter(shop -> calculateDistance(latitude, longitude, shop.getLatitude(), shop.getLongitude()) <= radiusKm)
                .collect(Collectors.toList());
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371;

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    @Transactional(readOnly = true)
    public TireShop getTireShopById(int id) {
        return tireShopRepository.findById(id).orElse(null);
    }

    @Transactional
    public TireShop createTireShop(TireShop tireShop) {
        return tireShopRepository.save(tireShop);
    }

    @Transactional
    public TireShop updateTireShop(int id, TireShop updatedTireShop) {
        TireShop existingTireShop = tireShopRepository.findById(id).orElse(null);
        if (existingTireShop != null) {
            existingTireShop.setShopName(updatedTireShop.getShopName());
            existingTireShop.setPhone(updatedTireShop.getPhone());
            existingTireShop.setLocation(updatedTireShop.getLocation());
            existingTireShop.setAddress(updatedTireShop.getAddress());
            existingTireShop.setLatitude(updatedTireShop.getLatitude());
            existingTireShop.setLongitude(updatedTireShop.getLongitude());
            existingTireShop.setOpeningHour(updatedTireShop.getOpeningHour());
            existingTireShop.setClosingHour(updatedTireShop.getClosingHour());
            
            if (updatedTireShop.getPassword() != null && !updatedTireShop.getPassword().isEmpty()) {
                existingTireShop.setPassword(updatedTireShop.getPassword());
            }
            
            if (updatedTireShop.getEmail() != null && !updatedTireShop.getEmail().isEmpty()) {
                existingTireShop.setEmail(updatedTireShop.getEmail());
            }
            
            return tireShopRepository.save(existingTireShop);
        }
        return null;
    }

    @Transactional
    public boolean deleteTireShop(int id) {
        if (tireShopRepository.existsById(id)) {
            tireShopRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional(readOnly = true)
    public Optional<TireShop> findByEmail(String email) {
        return tireShopRepository.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public boolean validatePassword(TireShop tireShop, String password) {
        return password.equals(tireShop.getPassword());
    }

    public Optional<TireShop> findById(int id) {
        return tireShopRepository.findById(id);
    }
}
