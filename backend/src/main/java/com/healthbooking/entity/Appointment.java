package com.healthbooking.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

import java.time.LocalDateTime;

@Entity
public class Appointment extends PanacheEntity {

    public Long patientId;

    public Long slotId;

    public String status;

    public LocalDateTime createdAt;
}