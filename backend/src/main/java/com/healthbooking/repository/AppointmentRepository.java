package com.healthbooking.repository;

import com.healthbooking.entity.Appointment;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class AppointmentRepository implements PanacheRepository<Appointment> {
}