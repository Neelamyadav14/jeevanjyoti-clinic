import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingData, setBookingData] = useState({
    appointment_date: '',
    appointment_time: '',
    symptoms: ''
  });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments/my');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      await api.post('/appointments/book', bookingData);
      setShowBooking(false);
      fetchAppointments();
      alert('Appointment booked successfully!');
    } catch (err) {
      alert('Booking failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-teal-600 text-white px-6 py-4 flex justify-between items-center shadow">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-teal-600 rounded"></div>
          </div>
          <div>
            <p className="font-bold text-sm">Jeevan Jyoti Clinic</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-teal-100">Hello, {user?.name}</span>
          <button
            onClick={() => navigate('/shop')}
            className="bg-teal-500 border border-teal-400 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-teal-400 transition"
          >
            Shop
          </button>
          <button
            onClick={handleLogout}
            className="bg-white text-teal-600 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6">

        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-700 text-white p-6 rounded-2xl mb-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-1">Welcome, {user?.name}</h2>
          <p className="text-teal-100 text-sm">Manage your appointments and health records here.</p>
          <button
            onClick={() => setShowBooking(true)}
            className="mt-4 bg-white text-teal-600 px-6 py-2 rounded-xl font-semibold hover:bg-gray-100 transition text-sm"
          >
            Book Appointment
          </button>
        </div>

        {/* Booking Modal */}
        {showBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Book Appointment</h3>
              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={bookingData.appointment_date}
                    onChange={(e) => setBookingData({...bookingData, appointment_date: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    value={bookingData.appointment_time}
                    onChange={(e) => setBookingData({...bookingData, appointment_time: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Describe your symptoms</label>
                  <textarea
                    value={bookingData.symptoms}
                    onChange={(e) => setBookingData({...bookingData, symptoms: e.target.value})}
                    rows="3"
                    placeholder="What are you experiencing?"
                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-sm resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition text-sm"
                  >
                    Book
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBooking(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Appointments */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">My Appointments</h3>
          <span className="text-sm text-gray-400">{appointments.length} total</span>
        </div>

        {appointments.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl shadow-sm border text-center">
            <p className="text-gray-400">No appointments yet. Book your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div key={apt.id} className="bg-white p-5 rounded-2xl shadow-sm border hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-gray-800">{new Date(apt.appointment_date).toDateString()}</p>
                    <p className="text-sm text-gray-400 mt-1">{apt.appointment_time}</p>
                    {apt.symptoms && (
                      <p className="text-sm text-gray-500 mt-2 bg-gray-50 px-3 py-1.5 rounded-lg inline-block">{apt.symptoms}</p>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {apt.status?.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}