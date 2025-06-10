package com.example.demo.dto;

import com.example.demo.entity.AppointmentStatus;

public class AppointmentResponse {
    private int id;
    private String date;
    private String time;
    private String shopName;
    private String address;
    private ServiceDto service;
    private String vehicle;
    private AppointmentStatus status;
    private String customerName;
    private String customerPhone;

    // Constructor
    public AppointmentResponse() {}

    public AppointmentResponse(int id, String date, String time, String shopName, String address, 
                             ServiceDto service, String vehicle, AppointmentStatus status,
                             String customerName, String customerPhone) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.shopName = shopName;
        this.address = address;
        this.service = service;
        this.vehicle = vehicle;
        this.status = status;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public ServiceDto getService() {
        return service;
    }

    public void setService(ServiceDto service) {
        this.service = service;
    }

    public String getVehicle() {
        return vehicle;
    }

    public void setVehicle(String vehicle) {
        this.vehicle = vehicle;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    // Inner class for Service DTO
    public static class ServiceDto {
        private int id;
        private String serviceName;
        private double price;

        public ServiceDto() {}

        public ServiceDto(int id, String serviceName, double price) {
            this.id = id;
            this.serviceName = serviceName;
            this.price = price;
        }

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getServiceName() {
            return serviceName;
        }

        public void setServiceName(String serviceName) {
            this.serviceName = serviceName;
        }

        public double getPrice() {
            return price;
        }

        public void setPrice(double price) {
            this.price = price;
        }
    }
}
