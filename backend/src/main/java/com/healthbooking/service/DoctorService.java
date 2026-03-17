package com.healthbooking.service;

import com.healthbooking.dto.DoctorAppointmentView;
import com.healthbooking.dto.PageResponse;
import com.healthbooking.entity.Appointment;
import com.healthbooking.entity.Doctor;
import com.healthbooking.entity.Patient;
import com.healthbooking.entity.Slot;
import com.healthbooking.repository.AppointmentRepository;
import com.healthbooking.repository.DoctorRepository;
import com.healthbooking.repository.SlotRepository;

import io.quarkus.panache.common.Page;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class DoctorService {

    @Inject
    DoctorRepository doctorRepository;

    @Inject
    SlotRepository slotRepository;

    @Inject
    AppointmentRepository appointmentRepository;

    public PageResponse<Doctor> getDoctors(int page, int size) {
        if (size <= 0) size = 20;
        if (size > 100) size = 100;
        var panachePage = doctorRepository.findAll().page(Page.of(page, size));
        return new PageResponse<>(
                panachePage.list(),
                panachePage.count(),
                panachePage.pageCount(),
                size,
                page
        );
    }

    /**
     * Appointments booked against this doctor's slots (for doctor view).
     */
    public List<DoctorAppointmentView> getAppointmentsForDoctor(long doctorId) {
        List<Slot> slots = slotRepository.list("doctorId", doctorId);
        if (slots.isEmpty()) return List.of();
        List<Long> slotIds = slots.stream().map(s -> s.id).collect(Collectors.toList());
        List<Appointment> appointments = appointmentRepository.list("slotId in (?1)", slotIds);
        List<DoctorAppointmentView> result = new ArrayList<>();
        for (Appointment a : appointments) {
            Slot slot = slots.stream().filter(s -> s.id.equals(a.slotId)).findFirst().orElse(null);
            if (slot == null) continue;
            Patient patient = Patient.findById(a.patientId);
            String patientName = patient != null ? patient.name : "—";
            String patientEmail = patient != null ? patient.email : "";
            result.add(new DoctorAppointmentView(
                    a.id,
                    a.slotId,
                    slot.date,
                    slot.startTime,
                    slot.endTime,
                    a.patientId,
                    patientName,
                    patientEmail,
                    a.status != null ? a.status : "",
                    a.createdAt
            ));
        }
        result.sort((x, y) -> {
            int d = x.slotDate.compareTo(y.slotDate);
            if (d != 0) return d;
            return x.slotStartTime.compareTo(y.slotStartTime);
        });
        return result;
    }
}