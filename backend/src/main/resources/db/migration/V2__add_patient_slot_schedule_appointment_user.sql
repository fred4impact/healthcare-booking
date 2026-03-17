CREATE TABLE IF NOT EXISTS patient (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS schedule (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT,
    day_of_week INT,
    start_time TIME,
    end_time TIME,
    slot_duration INT
);

CREATE TABLE IF NOT EXISTS slot (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT,
    date DATE,
    start_time TIME,
    end_time TIME,
    available BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS appointment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT,
    slot_id BIGINT,
    status VARCHAR(50),
    created_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS app_user (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    patient_id BIGINT,
    CONSTRAINT fk_user_patient FOREIGN KEY (patient_id) REFERENCES patient(id)
);
