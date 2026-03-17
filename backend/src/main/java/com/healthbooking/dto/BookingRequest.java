package com.healthbooking.dto;

import jakarta.validation.constraints.NotNull;

public class BookingRequest {

    @NotNull
    public Long patientId;

    @NotNull
    public Long slotId;
}