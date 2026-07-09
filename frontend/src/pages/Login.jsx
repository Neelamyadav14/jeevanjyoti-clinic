import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (res.data.user.role === 'doctor') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">

      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-teal-600">

        <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-teal-600 to-teal-900"></div>
        <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] rounded-full bg-teal-400 opacity-20 animate-pulse"></div>
        <div className="absolute bottom-[-150px] right-[-100px] w-[600px] h-[600px] rounded-full bg-teal-800 opacity-30 animate-pulse" style={{animationDelay:'1s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-cyan-400 opacity-10 animate-ping" style={{animationDuration:'4s'}}></div>

        <div className="absolute inset-0 opacity-10"
          style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          <div>
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <div className="w-6 h-6 bg-teal-600 rounded-lg"></div>
            </div>
            <p className="text-white font-bold text-2xl tracking-tight">Jeevan Jyoti</p>
            <p className="text-teal-200 text-sm mt-1">Clinic & Wellness Centre</p>
          </div>

          <div>
            <h1 className="text-5xl font-bold text-white leading-tight mb-6 tracking-tight">
              Healthcare<br />
              <span className="text-teal-200">Simplified.</span>
            </h1>
            <p className="text-teal-100 text-lg leading-relaxed max-w-sm">
              Modern clinic management with AI-powered tools for better patient care.
            </p>

            <div className="mt-10 space-y-4">
              {[
                { title: 'Smart Appointments', desc: 'Book and manage with ease' },
                { title: 'AI Prescriptions', desc: 'Generate in seconds' },
                { title: 'Digital Records', desc: 'Always accessible' },
                { title: 'Natural Products', desc: 'Shop skincare essentials' },
              ].map((f) => (
                <div key={f.title} className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-teal-300"></div>
                  <div>
                    <span className="text-white font-semibold text-sm">{f.title}</span>
                    <span className="text-teal-300 text-sm"> — {f.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-teal-300 text-sm">
            Trusted by patients across the city
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div
          className={`w-full max-w-md transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
        >
          <div className="lg:hidden mb-8">
            <div className="w-10 h-10 bg-teal-600 rounded-xl mb-3"></div>
            <p className="font-bold text-gray-800 text-xl">Jeevan Jyoti Clinic</p>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">Sign in</h2>
          <p className="text-gray-400 text-sm mb-8">Welcome back. Enter your credentials to continue.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-gray-800 text-sm"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-gray-800 text-sm"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-semibold hover:bg-teal-700 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal-100 active:translate-y-0 disabled:opacity-60 text-sm mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            New patient?{' '}
            <Link to="/register" className="text-teal-600 font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}