package com.healthbooking.resource;

import com.healthbooking.dto.LoginRequest;
import com.healthbooking.dto.LoginResponse;
import com.healthbooking.service.AuthService;

import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;

@Path("/auth")
public class AuthResource {

    @Inject
    AuthService authService;

    @POST
    @Path("/login")
    @PermitAll
    public LoginResponse login(@Valid LoginRequest request) {
        return authService.login(request);
    }
}
