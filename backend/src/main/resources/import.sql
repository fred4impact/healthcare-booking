-- Prepopulate 3 doctors (run when using Hibernate drop-and-create, e.g. dev profile)
-- Table/column names must match Hibernate's schema (e.g. Doctor -> "Doctor" or "doctor" depending on config)
INSERT INTO Doctor (id, name, specialty) VALUES (1, 'Dr. Alice Smith', 'General Practice');
INSERT INTO Doctor (id, name, specialty) VALUES (2, 'Dr. Bob Jones', 'Cardiology');
INSERT INTO Doctor (id, name, specialty) VALUES (3, 'Dr. Carol Lee', 'Pediatrics');

-- Schedules so the slot scheduler can generate slots (MONDAY=1, TUESDAY=2, ..., SUNDAY=7)
INSERT INTO Schedule (id, doctorId, dayOfWeek, startTime, endTime, slotDuration) VALUES (1, 1, 1, '09:00', '17:00', 30);
INSERT INTO Schedule (id, doctorId, dayOfWeek, startTime, endTime, slotDuration) VALUES (2, 2, 2, '08:00', '16:00', 45);
INSERT INTO Schedule (id, doctorId, dayOfWeek, startTime, endTime, slotDuration) VALUES (3, 3, 3, '10:00', '18:00', 30);
