package com.example.demo.service;

import com.example.demo.entity.Notification;
import com.example.demo.repository.NotificationRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Transactional(readOnly = true)
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Notification getNotificationById(int id) {
        return notificationRepository.findById(id).orElse(null);
    }

    @Transactional
    public Notification createNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    @Transactional
    public Notification updateNotification(int id, Notification updated) {
        Notification existing = notificationRepository.findById(id).orElse(null);
        if (existing != null) {
            existing.setMessage(updated.getMessage());
            existing.setNotificationDate(updated.getNotificationDate());
            existing.setRead(updated.isRead());
            existing.setUser(updated.getUser());
            return notificationRepository.save(existing);
        }
        return null;
    }

    @Transactional
    public boolean deleteNotification(int id) {
        if (notificationRepository.existsById(id)) {
            notificationRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
