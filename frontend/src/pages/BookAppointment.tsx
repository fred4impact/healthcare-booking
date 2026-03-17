import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import type { Slot } from '../api/types'

export function BookAppointment() {
  const [patientId, setPatientId] = useState('')
  const [slotId, setSlotId] = useState<string>('')
  const queryClient = useQueryClient()

  const [page, setPage] = useState(0)
  const size = 50
  const { data: slotsData, isLoading: slotsLoading, error: slotsError } = useQuery({
    queryKey: ['slots', page, size],
    queryFn: () => api.getSlots(page, size),
  })
  const slots = slotsData?.content ?? []
  const availableSlots = slots.filter((s: Slot) => s.available)
  const totalPages = slotsData?.totalPages ?? 0

  const bookMutation = useMutation({
    mutationFn: (body: { patientId: number; slotId: number }) => api.bookAppointment(body),
    onSuccess: () => {
      setSlotId('')
      queryClient.invalidateQueries({ queryKey: ['slots'] })
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const pid = Number(patientId)
    const sid = Number(slotId)
    if (!pid || !sid) return
    bookMutation.mutate({ patientId: pid, slotId: sid })
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Book appointment</h1>
      <p className="text-gray-600 mb-4">
        Enter your patient ID (from registration) and choose an available slot.
      </p>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
            Patient ID
          </label>
          <input
            id="patientId"
            type="number"
            min={1}
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="slotId" className="block text-sm font-medium text-gray-700 mb-1">
            Available slot
          </label>
          <select
            id="slotId"
            value={slotId}
            onChange={(e) => setSlotId(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
          >
            <option value="">Select a slot</option>
            {availableSlots.map((s: Slot) => (
              <option key={s.id} value={s.id}>
                Doctor {s.doctorId} — {s.date} {s.startTime}–{s.endTime}
              </option>
            ))}
          </select>
          {totalPages > 1 && (
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="text-sm px-2 py-1 border rounded disabled:opacity-50"
              >
                Prev page
              </button>
              <span className="text-sm text-gray-600">Page {page + 1}/{totalPages}</span>
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="text-sm px-2 py-1 border rounded disabled:opacity-50"
              >
                Next page
              </button>
            </div>
          )}
        </div>
        {slotsLoading && <p className="text-gray-500 text-sm">Loading slots…</p>}
        {slotsError && (
          <p className="text-red-600 text-sm">Failed to load slots: {(slotsError as Error).message}</p>
        )}
        {bookMutation.isError && (
          <p className="text-red-600 text-sm">{(bookMutation.error as Error).message}</p>
        )}
        {bookMutation.isSuccess && (
          <p className="text-green-600 text-sm">Appointment booked successfully.</p>
        )}
        <button
          type="submit"
          disabled={bookMutation.isPending || !slotId}
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
        >
          {bookMutation.isPending ? 'Booking…' : 'Book'}
        </button>
      </form>
    </div>
  )
}
