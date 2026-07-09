import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [referralForm, setReferralForm] = useState({
    patient_id: '',
    referred_to: '',
    specialization: '',
    reason: '',
    notes: ''
  });
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchReferrals();
    fetchOrders();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/appointments/all');
      setAppointments(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchPatients = async () => {
    try {
      const res = await api.get('/patients/all');
      setPatients(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchReferrals = async () => {
    try {
      const res = await api.get('/referrals/all');
      setReferrals(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/products/orders/all');
      setOrders(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchPatientDetails = async (id) => {
    try {
      const res = await api.get(`/patients/${id}`);
      setSelectedPatient(res.data);
    } catch (err) { console.error(err); }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await api.put(`/appointments/${id}/status`, { status });
      fetchAppointments();
    } catch (err) { console.error(err); }
  };

  const handleReferralSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/referrals/add', referralForm);
      setReferralForm({ patient_id: '', referred_to: '', specialization: '', reason: '', notes: '' });
      fetchReferrals();
      alert('Referral added successfully!');
    } catch (err) {
      alert('Failed to add referral');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const tabs = [
    { id: 'appointments', label: 'Appointments' },
    { id: 'patients', label: 'Patients' },
    { id: 'referrals', label: 'Referrals' },
    { id: 'orders', label: 'Orders' },
  ];

  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;
  const specializations = ['Dermatologist', 'Gynecologist', 'Orthopedic', 'Cardiologist', 'Neurologist', 'Pediatrician', 'ENT', 'Ophthalmologist', 'Psychiatrist', 'Urologist'];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex h-screen overflow-hidden">

        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-teal-700 to-teal-900 text-white flex flex-col shadow-xl">
          <div className="p-6 border-b border-teal-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <div className="w-5 h-5 bg-teal-600 rounded-lg"></div>
              </div>
              <div>
                <p className="font-bold text-sm">Jeevan Jyoti</p>
                <p className="text-teal-300 text-xs">Clinic</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-teal-600">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center font-bold text-lg">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-teal-300 text-xs">General Physician</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-teal-700 shadow'
                    : 'text-teal-100 hover:bg-teal-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-teal-600 space-y-1">
            <button
              onClick={() => navigate('/analytics')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-teal-100 hover:bg-teal-600 transition"
            >
              Analytics
            </button>
            <button
              onClick={() => navigate('/change-password')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-teal-100 hover:bg-teal-600 transition"
            >
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-teal-100 hover:bg-teal-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">

          {/* Top Header */}
          <div className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {tabs.find(t => t.id === activeTab)?.label}
              </h1>
              <p className="text-sm text-gray-400">
                {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-xl text-center">
                <p className="text-lg font-bold text-yellow-600">{pendingCount}</p>
                <p className="text-xs text-yellow-500">Pending</p>
              </div>
              <div className="bg-green-50 border border-green-200 px-4 py-2 rounded-xl text-center">
                <p className="text-lg font-bold text-green-600">{confirmedCount}</p>
                <p className="text-xs text-green-500">Confirmed</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-xl text-center">
                <p className="text-lg font-bold text-blue-600">{patients.length}</p>
                <p className="text-xs text-blue-500">Patients</p>
              </div>
            </div>
          </div>

          <div className="p-8">

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div className="space-y-4">
                {appointments.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm border">
                    <p className="text-gray-400 text-lg">No appointments yet</p>
                  </div>
                ) : (
                  appointments.map((apt) => (
                    <div key={apt.id} className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-xl font-bold text-teal-600">
                            {apt.patient_name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800 text-lg">{apt.patient_name}</p>
                            <p className="text-sm text-gray-400">{apt.phone}</p>
                            <div className="flex gap-4 mt-2">
                              <span className="text-sm text-gray-500">{new Date(apt.appointment_date).toDateString()}</span>
                              <span className="text-sm text-gray-500">{apt.appointment_time}</span>
                            </div>
                            {apt.symptoms && (
                              <div className="mt-2 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-lg inline-block">
                                <p className="text-sm text-orange-700">{apt.symptoms}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                            apt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                            apt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {apt.status?.toUpperCase()}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                              className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg hover:bg-green-600 transition"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                              className="text-xs bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition"
                            >
                              Complete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Patients Tab */}
            {activeTab === 'patients' && (
              <div className="grid grid-cols-5 gap-6">
                <div className="col-span-2 space-y-3">
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white shadow-sm text-sm"
                  />
                  {patients.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => fetchPatientDetails(p.id)}
                      className={`bg-white p-4 rounded-xl shadow-sm border cursor-pointer hover:border-teal-400 transition ${
                        selectedPatient?.patient?.id === p.id ? 'border-teal-500 ring-2 ring-teal-200' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {p.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{p.name}</p>
                          <p className="text-xs text-gray-400">{p.phone} • {p.blood_group || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="col-span-3">
                  {selectedPatient ? (
                    <div className="bg-white rounded-2xl shadow-sm border p-6">
                      <div className="flex items-center gap-4 mb-6 pb-4 border-b">
                        <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                          {selectedPatient.patient?.name?.charAt(0)}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">{selectedPatient.patient?.name}</h2>
                          <p className="text-gray-400 text-sm">{selectedPatient.patient?.email}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">{selectedPatient.patient?.blood_group || 'N/A'}</span>
                            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">{selectedPatient.patient?.gender}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1">Phone</p>
                          <p className="font-medium text-gray-700 text-sm">{selectedPatient.patient?.phone || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs text-gray-400 mb-1">Date of Birth</p>
                          <p className="font-medium text-gray-700 text-sm">{selectedPatient.patient?.date_of_birth || 'N/A'}</p>
                        </div>
                        <div className="bg-orange-50 rounded-xl p-3 col-span-2">
                          <p className="text-xs text-orange-400 mb-1">Allergies</p>
                          <p className="font-medium text-orange-700 text-sm">{selectedPatient.patient?.allergies || 'None reported'}</p>
                        </div>
                      </div>

                      <h3 className="font-bold text-gray-700 mb-3 text-sm">Past Appointments ({selectedPatient.appointments?.length})</h3>
                      <div className="space-y-2 mb-4">
                        {selectedPatient.appointments?.slice(0, 4).map((apt) => (
                          <div key={apt.id} className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded-lg">
                            <span className="text-gray-600">{new Date(apt.appointment_date).toDateString()}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              apt.status === 'completed' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600'
                            }`}>{apt.status}</span>
                          </div>
                        ))}
                      </div>

                      <h3 className="font-bold text-gray-700 mb-3 text-sm">Medical Records ({selectedPatient.medical_records?.length})</h3>
                      <div className="space-y-2">
                        {selectedPatient.medical_records?.length === 0 && (
                          <p className="text-gray-400 text-sm">No records yet</p>
                        )}
                        {selectedPatient.medical_records?.slice(0, 3).map((rec) => (
                          <div key={rec.id} className="text-sm bg-gray-50 px-3 py-2 rounded-lg">
                            <p className="font-medium text-gray-700">{rec.diagnosis}</p>
                            <p className="text-gray-400 text-xs">{new Date(rec.created_at).toDateString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
                      <p className="text-gray-400">Select a patient to view details</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Referrals Tab */}
            {activeTab === 'referrals' && (
              <div className="grid grid-cols-5 gap-6">
                <div className="col-span-2">
                  <div className="bg-white rounded-2xl shadow-sm border p-6">
                    <div className="w-8 h-1 bg-teal-600 rounded-full mb-4"></div>
                    <h3 className="font-bold text-gray-800 mb-1">Add New Referral</h3>
                    <p className="text-gray-400 text-xs mb-5">Refer a patient to a specialist</p>

                    <form onSubmit={handleReferralSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Patient</label>
                        <select
                          value={referralForm.patient_id}
                          onChange={(e) => setReferralForm({...referralForm, patient_id: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-sm"
                          required
                        >
                          <option value="">Select patient</option>
                          {patients.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Specialization</label>
                        <select
                          value={referralForm.specialization}
                          onChange={(e) => setReferralForm({...referralForm, specialization: e.target.value})}
                          className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-sm"
                          required
                        >
                          <option value="">Select specialization</option>
                          {specializations.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Referred To (Doctor Name)</label>
                        <input
                          type="text"
                          value={referralForm.referred_to}
                          onChange={(e) => setReferralForm({...referralForm, referred_to: e.target.value})}
                          placeholder="Dr. Name"
                          className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Reason</label>
                        <input
                          type="text"
                          value={referralForm.reason}
                          onChange={(e) => setReferralForm({...referralForm, reason: e.target.value})}
                          placeholder="Reason for referral"
                          className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Notes (Optional)</label>
                        <textarea
                          value={referralForm.notes}
                          onChange={(e) => setReferralForm({...referralForm, notes: e.target.value})}
                          rows="2"
                          placeholder="Additional notes..."
                          className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-sm resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-teal-600 text-white py-3 rounded-xl font-semibold hover:bg-teal-700 transition text-sm"
                      >
                        Add Referral
                      </button>
                    </form>
                  </div>
                </div>

                <div className="col-span-3 space-y-3">
                  <h3 className="font-bold text-gray-800">All Referrals ({referrals.length})</h3>
                  {referrals.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center shadow-sm border">
                      <p className="text-gray-400">No referrals added yet</p>
                    </div>
                  ) : (
                    referrals.map((ref) => (
                      <div key={ref.id} className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center font-bold text-purple-600">
                              {ref.patient_name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">{ref.patient_name}</p>
                              <p className="text-sm text-gray-500">Referred to: <span className="font-medium text-purple-600">{ref.referred_to}</span></p>
                              <p className="text-sm text-gray-400">{ref.specialization}</p>
                              <p className="text-sm text-gray-600 mt-1">{ref.reason}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            ref.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {ref.status?.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white rounded-2xl p-5 shadow-sm border text-center">
                    <p className="text-3xl font-bold text-teal-600">{orders.length}</p>
                    <p className="text-gray-400 text-sm mt-1">Total Orders</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 shadow-sm border text-center">
                    <p className="text-3xl font-bold text-yellow-600">{orders.filter(o => o.status === 'pending').length}</p>
                    <p className="text-gray-400 text-sm mt-1">Pending</p>
                  </div>
                  <div className="bg-white rounded-2xl p-5 shadow-sm border text-center">
                    <p className="text-3xl font-bold text-green-600">
                      ₹{orders.reduce((sum, o) => sum + Number(o.total_price), 0)}
                    </p>
                    <p className="text-gray-400 text-sm mt-1">Total Revenue</p>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm border">
                    <p className="text-gray-400 text-lg">No orders yet</p>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-2xl p-5 shadow-sm border hover:shadow-md transition">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-gray-800">{order.customer_name}</p>
                          <p className="text-sm text-gray-400">{order.customer_phone}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            Product: <span className="font-medium">{order.product_name}</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: <span className="font-medium">{order.quantity}</span>
                            {order.quantity >= 10 && (
                              <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">Home Delivery</span>
                            )}
                          </p>
                          {order.customer_address && (
                            <p className="text-sm text-gray-500 mt-1">Address: {order.customer_address}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-teal-600">₹{order.total_price}</p>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold mt-2 inline-block ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status?.toUpperCase()}
                          </span>
                          <p className="text-xs text-gray-400 mt-2">{new Date(order.created_at).toDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}