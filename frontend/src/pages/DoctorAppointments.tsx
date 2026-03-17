import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import type { Doctor } from '../api/types'
import type { DoctorAppointmentView } from '../api/types'

export function DoctorAppointments() {
  const [doctorId, setDoctorId] = useState<number | ''>('')
  const [page] = useState(0)
  const size = 20

  const { data: doctorsData } = useQuery({
    queryKey: ['doctors', page, size],
    queryFn: () => api.getDoctors(page, size),
  })
  const doctors = doctorsData?.content ?? []

  const { data: appointments = [], isLoading, error } = useQuery({
    queryKey: ['doctor-appointments', doctorId],
    queryFn: () => api.getDoctorAppointments(Number(doctorId)),
    enabled: doctorId !== '',
  })

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Doctor view: appointments by doctor</h1>
      <p className="text-gray-600 mb-4">
        Select a doctor to see all appointments booked against their slots.
      </p>
      <div className="mb-6">
        <label htmlFor="doctor-select" className="block text-sm font-medium text-gray-700 mb-1">
          Doctor
        </label>
        <select
          id="doctor-select"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value === '' ? '' : Number(e.target.value))}
          className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
        >
          <option value="">Select a doctor</option>
          {doctors.map((d: Doctor) => (
            <option key={d.id} value={d.id}>
              {d.name} — {d.specialty}
            </option>
          ))}
        </select>
      </div>
      {doctorId === '' && (
        <p className="text-gray-500 text-sm">Select a doctor above to load their appointments.</p>
      )}
      {doctorId !== '' && isLoading && <p className="text-gray-500">Loading appointments…</p>}
      {doctorId !== '' && error && (
        <p className="text-red-600 text-sm">Failed to load: {(error as Error).message}</p>
      )}
      {doctorId !== '' && !isLoading && !error && (
        <>
          {appointments.length === 0 ? (
            <p className="text-gray-500">No appointments booked for this doctor yet.</p>
          ) : (
            <ul className="space-y-3">
              {(appointments as DoctorAppointmentView[]).map((a) => (
                <li
                  key={a.appointmentId}
                  className="p-4 rounded-lg border border-gray-200 bg-white flex flex-wrap gap-x-4 gap-y-1"
                >
                  <span className="font-medium text-gray-900">{a.slotDate}</span>
                  <span className="text-gray-600">{a.slotStartTime}–{a.slotEndTime}</span>
                  <span className="text-gray-700">Patient: {a.patientName}</span>
                  <span className="text-gray-500 text-sm">{a.patientEmail}</span>
                  <span className="text-sm text-teal-600">{a.status}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}
