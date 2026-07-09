import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function Analytics() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [orders, setOrders] = useState([]);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
    setTimeout(() => setMounted(true), 100);
  }, []);

  const fetchAll = async () => {
    try {
      const [a, p, r, o] = await Promise.all([
        api.get('/appointments/all'),
        api.get('/patients/all'),
        api.get('/referrals/all'),
        api.get('/products/orders/all'),
      ]);
      setAppointments(a.data);
      setPatients(p.data);
      setReferrals(r.data);
      setOrders(o.data);
    } catch (err) {
      console.error(err);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_price), 0);
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
  const homeDeliveryOrders = orders.filter(o => o.quantity >= 10).length;

  // Referrals by specialization
  const referralsBySpec = referrals.reduce((acc, r) => {
    acc[r.specialization] = (acc[r.specialization] || 0) + 1;
    return acc;
  }, {});

  // Orders by product
  const ordersByProduct = orders.reduce((acc, o) => {
    acc[o.product_name] = (acc[o.product_name] || 0) + o.quantity;
    return acc;
  }, {});

  const maxReferrals = Math.max(...Object.values(referralsBySpec), 1);
  const maxOrders = Math.max(...Object.values(ordersByProduct), 1);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Analytics</h1>
          <p className="text-sm text-gray-400">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button
          onClick={() => navigate('/doctor/dashboard')}
          className="bg-teal-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-teal-700 transition"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-8 space-y-8">

        {/* Key Metrics */}
        <div>
          <div className="w-8 h-1 bg-teal-600 rounded-full mb-4"></div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Overview</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Patients', value: patients.length, color: 'teal' },
              { label: 'Total Appointments', value: appointments.length, color: 'blue' },
              { label: 'Total Referrals', value: referrals.length, color: 'purple' },
              { label: 'Total Revenue', value: `₹${totalRevenue}`, color: 'green' },
            ].map((metric, i) => (
              <div
                key={metric.label}
                className={`bg-white rounded-2xl p-5 shadow-sm border transition-all duration-500 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={`w-8 h-1 rounded-full mb-3 bg-${metric.color}-500`}></div>
                <p className={`text-3xl font-bold text-${metric.color}-600`}>{metric.value}</p>
                <p className="text-gray-400 text-sm mt-1">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Appointment Breakdown */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="w-8 h-1 bg-teal-600 rounded-full mb-4"></div>
          <h2 className="text-lg font-bold text-gray-800 mb-6">Appointment Status Breakdown</h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'Pending', value: pendingAppointments, total: appointments.length, color: 'yellow' },
              { label: 'Confirmed', value: confirmedAppointments, total: appointments.length, color: 'green' },
              { label: 'Completed', value: completedAppointments, total: appointments.length, color: 'blue' },
            ].map((item) => {
              const percentage = appointments.length > 0 ? Math.round((item.value / appointments.length) * 100) : 0;
              return (
                <div key={item.label} className="text-center">
                  <div className="relative w-24 h-24 mx-auto mb-3">
                    <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke={item.color === 'yellow' ? '#eab308' : item.color === 'green' ? '#22c55e' : '#3b82f6'}
                        strokeWidth="3"
                        strokeDasharray={`${percentage}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-800">{percentage}%</span>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-700">{item.label}</p>
                  <p className="text-sm text-gray-400">{item.value} appointments</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">

          {/* Referrals by Specialization */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="w-8 h-1 bg-purple-500 rounded-full mb-4"></div>
            <h2 className="text-lg font-bold text-gray-800 mb-6">Referrals by Specialization</h2>
            {Object.keys(referralsBySpec).length === 0 ? (
              <p className="text-gray-400 text-sm">No referrals yet</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(referralsBySpec).sort((a, b) => b[1] - a[1]).map(([spec, count]) => (
                  <div key={spec}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{spec}</span>
                      <span className="text-sm font-bold text-purple-600">{count}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${(count / maxReferrals) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Sales */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <div className="w-8 h-1 bg-green-500 rounded-full mb-4"></div>
            <h2 className="text-lg font-bold text-gray-800 mb-6">Product Sales (Units)</h2>
            {Object.keys(ordersByProduct).length === 0 ? (
              <p className="text-gray-400 text-sm">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(ordersByProduct).sort((a, b) => b[1] - a[1]).map(([product, qty]) => (
                  <div key={product}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{product}</span>
                      <span className="text-sm font-bold text-green-600">{qty} units</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${(qty / maxOrders) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Revenue breakdown */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm font-semibold text-gray-700 mb-3">Revenue Breakdown</p>
              <div className="space-y-2">
                {orders.reduce((acc, o) => {
                  const existing = acc.find(i => i.name === o.product_name);
                  if (existing) {
                    existing.revenue += Number(o.total_price);
                  } else {
                    acc.push({ name: o.product_name, revenue: Number(o.total_price) });
                  }
                  return acc;
                }, []).map((item) => (
                  <div key={item.name} className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">{item.name}</span>
                    <span className="text-sm font-bold text-gray-800">₹{item.revenue}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <span className="text-sm font-semibold text-gray-700">Total</span>
                  <span className="text-sm font-bold text-teal-600">₹{totalRevenue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Summary */}
        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <div className="w-8 h-1 bg-blue-500 rounded-full mb-4"></div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-gray-800">{orders.length}</p>
              <p className="text-sm text-gray-400 mt-1">Total Orders</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{homeDeliveryOrders}</p>
              <p className="text-sm text-gray-400 mt-1">Home Delivery</p>
            </div>
            <div className="bg-teal-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-teal-600">{orders.length - homeDeliveryOrders}</p>
              <p className="text-sm text-gray-400 mt-1">Walk-in Orders</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}