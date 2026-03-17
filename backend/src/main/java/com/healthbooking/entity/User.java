package com.healthbooking.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "app_user")
public class User extends PanacheEntity {

    public String email;
    public String passwordHash;
    public String role;
    public Long patientId;
}
