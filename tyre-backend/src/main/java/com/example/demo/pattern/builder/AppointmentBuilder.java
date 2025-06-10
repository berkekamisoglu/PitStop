package com.example.demo.pattern.builder;

import com.example.demo.entity.Appointment;
import com.example.demo.entity.TireShop;
import com.example.demo.entity.User;
import com.example.demo.entity.TireShopService;

import java.time.LocalDateTime;

// DESIGN PATTERN: Builder Pattern
// Karmaşık Appointment nesnelerini adım adım oluşturmak için kullanılır
// Method chaining ile fluent interface sağlar
public class AppointmentBuilder {

    private final Appointment appointment;

    public AppointmentBuilder() {
        appointment = new Appointment();
    }

    public AppointmentBuilder withUser(User user) {
        appointment.setUser(user);
        return this;
    }

    public AppointmentBuilder withTireShop(TireShop shop) {
        appointment.setTireShop(shop);
        return this;
    }

    public AppointmentBuilder withDate(LocalDateTime date) {
        appointment.setAppointmentDate(date);
        return this;
    }

    public AppointmentBuilder withService(TireShopService service) {
        appointment.setService(service);
        return this;
    }

    public Appointment build() {
        return appointment;
    }
}
