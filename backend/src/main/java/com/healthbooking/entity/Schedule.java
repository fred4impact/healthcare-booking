package com.healthbooking.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

import java.time.DayOfWeek;
import java.time.LocalTime;

@Entity
public class Schedule extends PanacheEntity {

    public Long doctorId;

    public DayOfWeek dayOfWeek;

    public LocalTime startTime;

    public LocalTime endTime;

    public int slotDuration;
}