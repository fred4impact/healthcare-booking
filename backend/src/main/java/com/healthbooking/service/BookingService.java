package com.healthbooking.service;

import com.healthbooking.dto.BookingRequest;
import com.healthbooking.entity.Appointment;
import com.healthbooking.entity.Slot;
import com.healthbooking.repository.AppointmentRepository;
import com.healthbooking.repository.SlotRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;

@ApplicationScoped
public class BookingService {

    @Inject
    SlotRepository slotRepository;

    @Inject
    AppointmentRepository appointmentRepository;

    @Transactional
    public Appointment book(BookingRequest request) {

        Slot slot = slotRepository.findById(request.slotId);

        if(!slot.available)
            throw new RuntimeException("Slot already booked");

        slot.available=false;

        Appointment appointment=new Appointment();
        appointment.patientId=request.patientId;
        appointment.slotId=request.slotId;
        appointment.status="BOOKED";
        appointment.createdAt=LocalDateTime.now();

        appointmentRepository.persist(appointment);

        return appointment;
    }
}