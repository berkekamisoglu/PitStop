package com.example.demo.controller;

import com.example.demo.dto.AuthRequest;
import com.example.demo.dto.AuthResponse;
import com.example.demo.entity.TireShop;
import com.example.demo.service.TireShopService;
import com.example.demo.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// DESIGN PATTERN: MVC Pattern - Controller Layer
// TireShop kimlik doğrulama işlemlerini yönetir
// Shop kayıt ve giriş endpoint'lerini sağlar
@RestController
@RequestMapping("/auth/tireshop")
public class TireShopAuthController {

    private final TireShopService tireShopService;
    private final JwtUtil jwtUtil;

    public TireShopAuthController(TireShopService tireShopService, JwtUtil jwtUtil) {
        this.tireShopService = tireShopService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        TireShop tireShop = tireShopService.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Lastikçi bulunamadı"));

        if (!tireShopService.validatePassword(tireShop, request.getPassword())) {
            throw new RuntimeException("Şifre yanlış");
        }

        String token = jwtUtil.generateToken(tireShop.getEmail(), tireShop.getId(), "SHOP");
        return ResponseEntity.ok(new AuthResponse(token, String.valueOf(tireShop.getId()), "SHOP", tireShop.getShopName()));
    }

    public static class TireShopRegisterRequest {
        private String email;
        private String password;
        private String name;
        private String phone;
        private String address;
        private Double latitude;
        private Double longitude;
        private String openingHour;
        private String closingHour;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public Double getLatitude() { return latitude; }
        public void setLatitude(Double latitude) { this.latitude = latitude; }
        public Double getLongitude() { return longitude; }
        public void setLongitude(Double longitude) { this.longitude = longitude; }
        public String getOpeningHour() { return openingHour; }
        public void setOpeningHour(String openingHour) { this.openingHour = openingHour; }
        public String getClosingHour() { return closingHour; }
        public void setClosingHour(String closingHour) { this.closingHour = closingHour; }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody TireShopRegisterRequest request) {
        if (tireShopService.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Bu e-posta adresi zaten kullanımda");
        }

        TireShop tireShop = new TireShop();
        tireShop.setEmail(request.getEmail());
        tireShop.setPassword(request.getPassword());
        tireShop.setShopName(request.getName());
        tireShop.setPhone(request.getPhone());
        tireShop.setAddress(request.getAddress());
        tireShop.setLatitude(request.getLatitude());
        tireShop.setLongitude(request.getLongitude());
        tireShop.setOpeningHour(request.getOpeningHour());
        tireShop.setClosingHour(request.getClosingHour());

        TireShop newTireShop = tireShopService.createTireShop(tireShop);

        String token = jwtUtil.generateToken(newTireShop.getEmail(), newTireShop.getId(), "SHOP");
        return ResponseEntity.ok(new AuthResponse(token, String.valueOf(newTireShop.getId()), "SHOP", newTireShop.getShopName()));
    }
} 