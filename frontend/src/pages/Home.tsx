import { Link } from 'react-router-dom'

export function Home() {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-900 mb-2">Healthcare Booking</h1>
      <p className="text-gray-600 mb-8">Book appointments with doctors quickly and easily.</p>
      <div className="mb-8 p-4 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700">
        <p className="font-medium text-gray-900 mb-1">How it works</p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Patient ID:</strong> When you register, the API creates your patient record and returns your <strong>Patient ID</strong>. It is shown on the registration success message—use it when booking appointments.</li>
          <li><strong>Doctors:</strong> The list of available doctors is loaded from the API when you open &quot;View doctors&quot; (paginated).</li>
        </ul>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          to="/doctors"
          className="block p-6 rounded-lg border border-gray-200 bg-white hover:border-teal-300 hover:shadow-md transition"
        >
          <h2 className="font-medium text-gray-900 mb-1">View doctors</h2>
          <p className="text-sm text-gray-500">Browse doctors and specialties</p>
        </Link>
        <Link
          to="/register"
          className="block p-6 rounded-lg border border-gray-200 bg-white hover:border-teal-300 hover:shadow-md transition"
        >
          <h2 className="font-medium text-gray-900 mb-1">Register as patient</h2>
          <p className="text-sm text-gray-500">Create your patient account</p>
        </Link>
        <Link
          to="/book"
          className="block p-6 rounded-lg border border-gray-200 bg-white hover:border-teal-300 hover:shadow-md transition"
        >
          <h2 className="font-medium text-gray-900 mb-1">Book appointment</h2>
          <p className="text-sm text-gray-500">Choose a slot and book</p>
        </Link>
        <Link
          to="/doctor-appointments"
          className="block p-6 rounded-lg border border-gray-200 bg-white hover:border-teal-300 hover:shadow-md transition"
        >
          <h2 className="font-medium text-gray-900 mb-1">Doctor view</h2>
          <p className="text-sm text-gray-500">See appointments by doctor</p>
        </Link>
      </div>
    </div>
  )
}
