-- Prepopulate 3 doctors (production / Flyway). Idempotent: insert only if missing.
INSERT INTO doctor (id, name, specialty)
SELECT 1, 'Dr. Alice Smith', 'General Practice' WHERE NOT EXISTS (SELECT 1 FROM doctor WHERE id = 1);
INSERT INTO doctor (id, name, specialty)
SELECT 2, 'Dr. Bob Jones', 'Cardiology' WHERE NOT EXISTS (SELECT 1 FROM doctor WHERE id = 2);
INSERT INTO doctor (id, name, specialty)
SELECT 3, 'Dr. Carol Lee', 'Pediatrics' WHERE NOT EXISTS (SELECT 1 FROM doctor WHERE id = 3);
