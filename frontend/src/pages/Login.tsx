import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { api, setToken } from '../api/client'
import type { LoginRequest } from '../api/types'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: (body: LoginRequest) => api.login(body),
    onSuccess: (data) => {
      setToken(data.token)
      navigate('/')
    },
  })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    mutation.mutate({ email, password })
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Log in</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
        {mutation.isError && (
          <p className="text-red-600 text-sm">{(mutation.error as Error).message}</p>
        )}
        <button
          type="submit"
          disabled={mutation.isPending}
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
        >
          {mutation.isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
