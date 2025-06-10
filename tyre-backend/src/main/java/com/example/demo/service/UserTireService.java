package com.example.demo.service;

import com.example.demo.entity.UserTire;
import com.example.demo.repository.UserTireRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserTireService {

    private final UserTireRepository userTireRepository;

    public UserTireService(UserTireRepository userTireRepository) {
        this.userTireRepository = userTireRepository;
    }

    @Transactional(readOnly = true)
    public List<UserTire> getAllUserTires() {
        return userTireRepository.findAll();
    }

    @Transactional(readOnly = true)
    public UserTire getUserTireById(int id) {
        return userTireRepository.findById(id).orElse(null);
    }

    @Transactional
    public UserTire createUserTire(UserTire userTire) {
        return userTireRepository.save(userTire);
    }

    @Transactional
    public UserTire updateUserTire(int id, UserTire updated) {
        UserTire existing = userTireRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setUser(updated.getUser());
            existing.setTireSize(updated.getTireSize());
            return userTireRepository.save(existing);
        }
        return null;
    }

    @Transactional
    public boolean deleteUserTire(int id) {
        if (userTireRepository.existsById(id)) {
            userTireRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
