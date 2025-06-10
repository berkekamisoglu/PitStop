package com.example.demo.service;

import com.example.demo.entity.City;
import com.example.demo.repository.CityRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CityService {

    private final CityRepository cityRepository;

    public CityService(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    @Transactional(readOnly = true)
    public List<City> getAllCities() {
        return cityRepository.findAll();
    }

    @Transactional(readOnly = true)
    public City getCityById(int id) {
        return cityRepository.findById(id).orElse(null);
    }

    @Transactional
    public City createCity(City city) {
        return cityRepository.save(city);
    }

    @Transactional
    public City updateCity(int id, City updatedCity) {
        City existingCity = cityRepository.findById(id).orElse(null);
        if (existingCity != null) {
            existingCity.setName(updatedCity.getName());
            return cityRepository.save(existingCity);
        }
        return null;
    }

    @Transactional
    public boolean deleteCity(int id) {
        if (cityRepository.existsById(id)) {
            cityRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
