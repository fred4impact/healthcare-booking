package com.healthbooking.service;

import com.healthbooking.dto.RegisterPatientRequest;
import com.healthbooking.entity.Patient;
import com.healthbooking.entity.User;
import com.healthbooking.repository.PatientRepository;
import com.healthbooking.repository.UserRepository;

import at.favre.lib.crypto.bcrypt.BCrypt;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class PatientService {

    @Inject
    PatientRepository repository;

    @Inject
    UserRepository userRepository;

    @Transactional
    public Patient register(RegisterPatientRequest request) {
        if (userRepository.findByEmail(request.email) != null) {
            throw new IllegalArgumentException("Email already registered");
        }
        Patient patient = new Patient();
        patient.name = request.name;
        patient.email = request.email;
        repository.persist(patient);

        User user = new User();
        user.email = request.email;
        user.passwordHash = BCrypt.withDefaults().hashToString(12, request.password.toCharArray());
        user.role = "PATIENT";
        user.patientId = patient.id;
        userRepository.persist(user);

        return patient;
    }
}