package com.healthbooking.repository;

import com.healthbooking.entity.Doctor;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class DoctorRepository implements PanacheRepository<Doctor> {
}