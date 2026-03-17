package com.healthbooking.dto;

public class LoginResponse {

    public String token;
    public Long patientId;
    public String role;

    public LoginResponse(String token, Long patientId, String role) {
        this.token = token;
        this.patientId = patientId;
        this.role = role;
    }
}
