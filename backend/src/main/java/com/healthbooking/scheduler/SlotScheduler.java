package com.healthbooking.scheduler;

import com.healthbooking.entity.Schedule;
import com.healthbooking.repository.ScheduleRepository;
import com.healthbooking.service.SlotGeneratorService;

import io.quarkus.runtime.StartupEvent;
import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@ApplicationScoped
public class SlotScheduler {

    private static final int DAYS_AHEAD = 14;

    @Inject
    ScheduleRepository scheduleRepository;

    @Inject
    SlotGeneratorService slotGeneratorService;

    /** Generate slots on application startup. */
    void onStart(@Observes StartupEvent event) {
        generateUpcomingSlots();
    }

    /**
     * Generates slots for the next DAYS_AHEAD days based on doctor schedules.
     * Runs every day at 00:30.
     */
    @Scheduled(cron = "0 30 0 * * ?")
    public void generateUpcomingSlots() {
        List<Schedule> schedules = scheduleRepository.listAll();
        LocalDate start = LocalDate.now();
        for (int i = 0; i < DAYS_AHEAD; i++) {
            LocalDate date = start.plusDays(i);
            DayOfWeek dayOfWeek = date.getDayOfWeek();
            for (Schedule schedule : schedules) {
                if (schedule.dayOfWeek == dayOfWeek) {
                    slotGeneratorService.generateSlots(schedule, date);
                }
            }
        }
    }
}
