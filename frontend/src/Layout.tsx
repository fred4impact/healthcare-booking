import { Link, Outlet, useNavigate } from 'react-router-dom'
import { clearToken, isAuthenticated } from './api/client'

export function Layout() {
  const navigate = useNavigate()
  const authenticated = isAuthenticated()

  function logout() {
    clearToken()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-6">
          <Link to="/" className="text-xl font-semibold text-teal-700 hover:text-teal-800">
            Health Booking
          </Link>
          <Link to="/doctors" className="text-gray-600 hover:text-gray-900">
            Doctors
          </Link>
          <Link to="/register" className="text-gray-600 hover:text-gray-900">
            Register
          </Link>
          <Link to="/book" className="text-gray-600 hover:text-gray-900">
            Book appointment
          </Link>
          <Link to="/doctor-appointments" className="text-gray-600 hover:text-gray-900">
            Doctor view
          </Link>
          {authenticated ? (
            <button type="button" onClick={logout} className="text-gray-600 hover:text-gray-900 ml-auto">
              Log out
            </button>
          ) : (
            <Link to="/login" className="text-gray-600 hover:text-gray-900 ml-auto">
              Log in
            </Link>
          )}
        </nav>
      </header>
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
