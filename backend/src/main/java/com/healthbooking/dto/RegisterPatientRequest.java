package com.healthbooking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class RegisterPatientRequest {

    @NotBlank
    public String name;

    @Email
    @NotBlank
    public String email;

    @NotBlank(message = "Password is required")
    public String password;
}