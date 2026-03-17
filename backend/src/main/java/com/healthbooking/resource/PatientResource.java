package com.healthbooking.resource;

import com.healthbooking.dto.RegisterPatientRequest;
import com.healthbooking.entity.Patient;
import com.healthbooking.service.PatientService;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

@Path("/patients")
public class PatientResource {

    @Inject
    PatientService service;

    @POST
    @PermitAll
    public Patient register(RegisterPatientRequest request) {
        return service.register(request);
    }
}