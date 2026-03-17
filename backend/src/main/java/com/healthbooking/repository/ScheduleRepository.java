package com.healthbooking.repository;

import com.healthbooking.entity.Schedule;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ScheduleRepository implements PanacheRepository<Schedule> {
}
