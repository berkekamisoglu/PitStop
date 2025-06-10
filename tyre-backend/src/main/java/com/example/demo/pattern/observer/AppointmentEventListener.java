package com.example.demo.pattern.observer;

import com.example.demo.entity.Appointment;

// DESIGN PATTERN: Observer Pattern - Observer Interface
// Randevu olaylarını dinleyen observer'ların implement etmesi gereken interface
public interface AppointmentEventListener {
    void onAppointmentCreated(Appointment appointment);
}
