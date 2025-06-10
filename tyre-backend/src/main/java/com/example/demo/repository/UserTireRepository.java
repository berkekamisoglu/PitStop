package com.example.demo.repository;

import com.example.demo.entity.UserTire;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserTireRepository extends JpaRepository<UserTire, Integer> {
}
