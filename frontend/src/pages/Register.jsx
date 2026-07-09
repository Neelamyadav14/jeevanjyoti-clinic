import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    gender: '',
    date_of_birth: '',
    blood_group: '',
    address: '',
    allergies: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { ...formData, role: 'patient' });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Panel */}
      <div className="hidden lg:flex w-2/5 relative overflow-hidden bg-teal-600">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-600 to-teal-900"></div>
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-teal-400 opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-150px] right-[-100px] w-[600px] h-[600px] rounded-full bg-teal-800 opacity-30 animate-pulse" style={{animationDelay:'1s'}}></div>
        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <div className="w-6 h-6 bg-teal-600 rounded-lg"></div>
            </div>
            <p className="text-white font-bold text-2xl tracking-tight">Jeevan Jyoti</p>
            <p className="text-teal-200 text-sm mt-1">Clinic & Wellness Centre</p>
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white leading-tight mb-6 tracking-tight">
              Your health<br />
              <span className="text-teal-200">journey starts<br />here.</span>
            </h1>
            <p className="text-teal-100 leading-relaxed">
              Create your patient profile and get access to appointments, medical records, and more.
            </p>

            <div className="mt-10 space-y-3">
              {[
                'Book appointments anytime',
                'View your medical history',
                'Receive digital prescriptions',
                'Shop natural skincare products',
              ].map((f) => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-300 bg-opacity-30 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-teal-200"></div>
                  </div>
                  <span className="text-teal-100 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-teal-300 text-sm">
            Already registered?{' '}
            <Link to="/login" className="text-white font-semibold hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-3/5 flex items-center justify-center bg-white p-8 overflow-y-auto">
        <div
          className={`w-full max-w-xl py-8 transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
        >
          <div className="lg:hidden mb-8">
            <div className="w-10 h-10 bg-teal-600 rounded-xl mb-3"></div>
            <p className="font-bold text-gray-800 text-xl">Jeevan Jyoti Clinic</p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Create account</h2>
          <p className="text-gray-400 text-sm mb-8">Fill in your details to register as a patient.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name + Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-sm text-gray-800"
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-sm text-gray-800"
                  placeholder="10-digit number"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-sm text-gray-800"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-sm text-gray-800"
                placeholder="Create a strong password"
                required
              />
            </div>

            {/* Gender + DOB + Blood Group */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
                <select
                  name="gender"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-sm text-gray-800"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-sm text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Blood Group</label>
                <select
                  name="blood_group"
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-sm text-gray-800"
                >
                  <option value="">Select</option>
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Allergies */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Known Allergies</label>
              <input
                type="text"
                name="allergies"
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-sm text-gray-800"
                placeholder="e.g. Penicillin, Dust (leave blank if none)"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
              <textarea
                name="address"
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-sm text-gray-800 resize-none"
                placeholder="Your full address"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-semibold hover:bg-teal-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-100 active:translate-y-0 disabled:opacity-60 text-sm mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}