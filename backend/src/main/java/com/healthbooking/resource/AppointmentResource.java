package com.healthbooking.resource;

import com.healthbooking.dto.BookingRequest;
import com.healthbooking.entity.Appointment;
import com.healthbooking.service.BookingService;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

@Path("/appointments")
public class AppointmentResource {

    @Inject
    BookingService bookingService;

    @POST
    @RolesAllowed("PATIENT")
    public Appointment book(BookingRequest request) {
        return bookingService.book(request);
    }
}