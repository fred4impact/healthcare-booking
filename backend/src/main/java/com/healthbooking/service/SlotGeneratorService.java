package com.healthbooking.service;

import com.healthbooking.entity.Schedule;
import com.healthbooking.entity.Slot;
import com.healthbooking.repository.SlotRepository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

@ApplicationScoped
public class SlotGeneratorService {

    @Inject
    SlotRepository repository;

    @Transactional
    public void generateSlots(Schedule schedule, LocalDate date) {
        LocalTime current = schedule.startTime;
        while (current.isBefore(schedule.endTime)) {
            LocalTime end = current.plusMinutes(schedule.slotDuration);
            if (repository.find("doctorId=?1 and date=?2 and startTime=?3",
                    schedule.doctorId, date, current).firstResult() == null) {
                Slot slot = new Slot();
                slot.doctorId = schedule.doctorId;
                slot.date = date;
                slot.startTime = current;
                slot.endTime = end;
                repository.persist(slot);
            }
            current = end;
        }
    }
}