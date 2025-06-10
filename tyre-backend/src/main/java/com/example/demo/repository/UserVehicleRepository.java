package com.example.demo.repository;

import com.example.demo.entity.UserVehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserVehicleRepository extends JpaRepository<UserVehicle, Integer> {
    List<UserVehicle> findByUserId(Integer userId);
}
