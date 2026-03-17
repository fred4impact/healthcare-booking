const API_BASE = import.meta.env.VITE_API_URL ?? ''
const TOKEN_KEY = 'booking_token'

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${path}`
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  }
  const token = getToken()
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  if (res.status === 204 || res.headers.get('content-length') === '0') return undefined as T
  return res.json() as Promise<T>
}

export const api = {
  login: (body: import('./types').LoginRequest) =>
    request<import('./types').LoginResponse>('/api/v1/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getDoctors: (page = 0, size = 20) =>
    request<import('./types').PageResponse<import('./types').Doctor>>(`/api/v1/doctors?page=${page}&size=${size}`),
  getSlots: (page = 0, size = 20) =>
    request<import('./types').PageResponse<import('./types').Slot>>(`/api/v1/slots?page=${page}&size=${size}`),
  registerPatient: (body: import('./types').RegisterPatientRequest) =>
    request<import('./types').Patient>('/api/v1/patients', { method: 'POST', body: JSON.stringify(body) }),
  bookAppointment: (body: import('./types').BookingRequest) =>
    request<import('./types').Appointment>('/api/v1/appointments', { method: 'POST', body: JSON.stringify(body) }),
  getDoctorAppointments: (doctorId: number) =>
    request<import('./types').DoctorAppointmentView[]>(`/api/v1/doctors/${doctorId}/appointments`),
}
