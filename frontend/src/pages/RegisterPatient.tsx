import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../api/client'
import type { RegisterPatientRequest } from '../api/types'

export function RegisterPatient() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (body: RegisterPatientRequest) => api.registerPatient(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate({ name, email, password })
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Register as patient</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        {mutation.isError && (
          <p className="text-red-600 text-sm">{(mutation.error as Error).message}</p>
        )}
        {mutation.isSuccess && mutation.data && (
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <p className="font-medium text-green-800">Registered successfully.</p>
            <p className="text-green-700 text-sm mt-1">
              Your <strong>Patient ID is {mutation.data.id}</strong>. Use this ID when booking appointments, and log in with your email and password above.
            </p>
            <p className="text-green-600 text-xs mt-2">You can now book appointments or log in.</p>
          </div>
        )}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
        >
          {mutation.isPending ? 'Registering…' : 'Register'}
        </button>
      </form>
    </div>
  )
}
