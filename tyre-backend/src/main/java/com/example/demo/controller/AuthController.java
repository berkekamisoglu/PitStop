package com.example.demo.controller;

import com.example.demo.dto.AuthRequest;
import com.example.demo.dto.AuthResponse;
import com.example.demo.entity.User;
import com.example.demo.entity.UserRole;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.UserRoleRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// DESIGN PATTERN: MVC Pattern - Controller Layer
// Kullanıcı kimlik doğrulama isteklerini yönetir
// REST API endpoint'lerini sağlar
@RestController
@RequestMapping("/auth/user")
public class AuthController {

    private final UserRepository userRepository;
    private final UserRoleRepository userRoleRepository;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, UserRoleRepository userRoleRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.userRoleRepository = userRoleRepository;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Şifre yanlış");
        }

        String role = user.getUserRole().getRoleName().toUpperCase();
        String token = jwtUtil.generateToken(user.getEmail(), user.getId(), role);
        return ResponseEntity.ok(new AuthResponse(token, String.valueOf(user.getId()), role, user.getName()));
    }

    public static class UserRegisterRequest {
        private String email;
        private String password;
        private String name;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody UserRegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Bu e-posta adresi zaten kullanımda");
        }

        UserRole userRole = userRoleRepository.findByRoleName("USER")
                .orElseThrow(() -> new RuntimeException("Kullanıcı rolü bulunamadı"));

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setName(request.getName());
        user.setUserRole(userRole);

        User newUser = userRepository.save(user);

        String token = jwtUtil.generateToken(newUser.getEmail(), newUser.getId(), "USER");
        return ResponseEntity.ok(new AuthResponse(token, String.valueOf(newUser.getId()), "USER", newUser.getName()));
    }
}
