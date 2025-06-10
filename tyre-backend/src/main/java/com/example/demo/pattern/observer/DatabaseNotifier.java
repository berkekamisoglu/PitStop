package com.example.demo.pattern.observer;

import com.example.demo.entity.Appointment;
import com.example.demo.entity.Notification;
import com.example.demo.repository.NotificationRepository;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.LocalDateTime;

// DESIGN PATTERN: Observer Pattern - Concrete Observer
// Randevu oluşturulduğunda veritabanına bildirim kaydı ekler
@Component
public class DatabaseNotifier implements AppointmentEventListener {

    private final NotificationRepository notificationRepository;

    public DatabaseNotifier(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void onAppointmentCreated(Appointment appointment) {
        Notification notification = new Notification();
        notification.setUser(appointment.getUser());
        notification.setMessage("Yeni randevunuz oluşturuldu: " + appointment.getAppointmentDate());

        // Şu anda zamanı al ve SQL uyumlu Timestamp tipine dönüştür
        notification.setNotificationDate(Timestamp.valueOf(LocalDateTime.now()));

        notification.setRead(false);
        notificationRepository.save(notification);
    }
}
