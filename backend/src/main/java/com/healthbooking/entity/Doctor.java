package com.healthbooking.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity
public class Doctor extends PanacheEntity {

    public String name;

    public String specialty;
}