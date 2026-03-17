export interface Doctor {
  id: number
  name: string
  specialty: string
}

export interface Slot {
  id: number
  doctorId: number
  date: string
  startTime: string
  endTime: string
  available: boolean
}

export interface Patient {
  id: number
  name: string
  email: string
}

export interface Appointment {
  id: number
  patientId: number
  slotId: number
  status: string
  createdAt: string
}

export interface RegisterPatientRequest {
  name: string
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  patientId: number | null
  role: string
}

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface BookingRequest {
  patientId: number
  slotId: number
}

/** Appointment row for doctor view: slot + patient info */
export interface DoctorAppointmentView {
  appointmentId: number
  slotId: number
  slotDate: string
  slotStartTime: string
  slotEndTime: string
  patientId: number
  patientName: string
  patientEmail: string
  status: string
  createdAt: string
}
