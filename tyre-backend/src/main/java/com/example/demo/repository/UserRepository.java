package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// DESIGN PATTERN: Repository Pattern
// User entity'si için veri erişim operasyonlarını sağlar
@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    
    Optional<User> findByEmail(String email);
}
