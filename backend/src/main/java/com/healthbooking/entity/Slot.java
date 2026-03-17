package com.healthbooking.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class Slot extends PanacheEntity {

    public Long doctorId;

    public LocalDate date;

    public LocalTime startTime;

    public LocalTime endTime;

    public boolean available = true;
}