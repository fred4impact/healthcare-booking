import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import type { Doctor } from '../api/types'

export function Doctors() {
  const [page, setPage] = useState(0)
  const size = 20
  const { data, isLoading, error } = useQuery({
    queryKey: ['doctors', page, size],
    queryFn: () => api.getDoctors(page, size),
  })

  if (isLoading) return <p className="text-gray-500">Loading doctors…</p>
  if (error) return <p className="text-red-600">Failed to load doctors: {(error as Error).message}</p>
  const doctors = data?.content ?? []
  const totalPages = data?.totalPages ?? 0

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Doctors</h1>
      {doctors.length === 0 ? (
        <p className="text-gray-500">No doctors found.</p>
      ) : (
        <>
          <ul className="space-y-3">
            {doctors.map((d: Doctor) => (
              <li
                key={d.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white"
              >
                <div>
                  <span className="font-medium text-gray-900">{d.name}</span>
                  <span className="text-gray-500 ml-2">— {d.specialty}</span>
                </div>
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <div className="mt-4 flex gap-2 items-center">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {page + 1} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
