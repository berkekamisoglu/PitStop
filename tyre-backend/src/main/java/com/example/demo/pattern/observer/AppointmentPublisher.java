package com.example.demo.pattern.observer;

import com.example.demo.entity.Appointment;
import org.springframework.stereotype.Component;

import java.util.List;

// DESIGN PATTERN: Observer Pattern - Subject/Publisher
// Randevu olaylarını yayınlar ve tüm observer'ları bilgilendirir
@Component
public class AppointmentPublisher {

    private final List<AppointmentEventListener> listeners;

    public AppointmentPublisher(List<AppointmentEventListener> listeners) {
        this.listeners = listeners;
    }

    public void notifyAppointmentCreated(Appointment appointment) {
        for (AppointmentEventListener listener : listeners) {
            listener.onAppointmentCreated(appointment);
        }
    }
}
