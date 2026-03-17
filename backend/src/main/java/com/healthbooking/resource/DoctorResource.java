package com.healthbooking.resource;

import com.healthbooking.dto.DoctorAppointmentView;
import com.healthbooking.dto.PageResponse;
import com.healthbooking.entity.Doctor;
import com.healthbooking.service.DoctorService;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.QueryParam;

import java.util.List;

@Path("/doctors")
public class DoctorResource {

    @Inject
    DoctorService service;

    @GET
    @PermitAll
    public PageResponse<Doctor> doctors(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("20") int size) {
        return service.getDoctors(page, size);
    }

    /**
     * Appointments booked against this doctor's slots (for doctor view).
     */
    @GET
    @Path("/{doctorId}/appointments")
    @RolesAllowed("PATIENT")
    public List<DoctorAppointmentView> doctorAppointments(@PathParam("doctorId") long doctorId) {
        return service.getAppointmentsForDoctor(doctorId);
    }
}