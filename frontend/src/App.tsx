import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Layout } from './Layout'
import { Home } from './pages/Home'
import { Doctors } from './pages/Doctors'
import { RegisterPatient } from './pages/RegisterPatient'
import { BookAppointment } from './pages/BookAppointment'
import { DoctorAppointments } from './pages/DoctorAppointments'
import { Login } from './pages/Login'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="doctors" element={<Doctors />} />
            <Route path="register" element={<RegisterPatient />} />
            <Route path="book" element={<BookAppointment />} />
            <Route path="doctor-appointments" element={<DoctorAppointments />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
