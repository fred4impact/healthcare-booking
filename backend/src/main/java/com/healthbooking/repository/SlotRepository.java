package com.healthbooking.repository;

import com.healthbooking.entity.Slot;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class SlotRepository implements PanacheRepository<Slot> {

    public List<Slot> findAvailableSlots(Long doctorId) {
        return list("doctorId=?1 and available=true", doctorId);
    }
}