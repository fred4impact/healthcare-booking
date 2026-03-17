package com.healthbooking.repository;

import com.healthbooking.entity.Patient;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class PatientRepository implements PanacheRepository<Patient> {
}