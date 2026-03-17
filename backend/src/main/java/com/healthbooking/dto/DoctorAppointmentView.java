package com.healthbooking.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Appointment view for a doctor: one of their slots booked by a patient.
 */
public class DoctorAppointmentView {

    public long appointmentId;
    public long slotId;
    public LocalDate slotDate;
    public LocalTime slotStartTime;
    public LocalTime slotEndTime;
    public long patientId;
    public String patientName;
    public String patientEmail;
    public String status;
    public LocalDateTime createdAt;

    public DoctorAppointmentView(long appointmentId, long slotId, LocalDate slotDate,
                                LocalTime slotStartTime, LocalTime slotEndTime,
                                long patientId, String patientName, String patientEmail,
                                String status, LocalDateTime createdAt) {
        this.appointmentId = appointmentId;
        this.slotId = slotId;
        this.slotDate = slotDate;
        this.slotStartTime = slotStartTime;
        this.slotEndTime = slotEndTime;
        this.patientId = patientId;
        this.patientName = patientName;
        this.patientEmail = patientEmail;
        this.status = status;
        this.createdAt = createdAt;
    }
}
