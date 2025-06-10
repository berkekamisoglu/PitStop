package com.example.demo.service;

import com.example.demo.pattern.adapter.IMapService;
import org.springframework.stereotype.Service;

@Service
public class MapMarkerService {

    private final IMapService mapService;

    public MapMarkerService(IMapService mapService) {
        this.mapService = mapService;
    }

    public void createHelpMarker(double latitude, double longitude) {
        String markerId = mapService.createMarker(latitude, longitude, "Lastik patladı, yardım lazım!");
        System.out.println("Oluşturulan Marker ID: " + markerId);
    }
}
