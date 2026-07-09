import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function ChangePassword() {
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.new_password !== form.confirm_password) {
      setError('New passwords do not match');
      return;
    }

    if (form.new_password.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/change-password', {
        current_password: form.current_password,
        new_password: form.new_password,
      });
      setSuccess('Password changed successfully!');
      setForm({ current_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => {
        if (user?.role === 'doctor') {
          navigate('/doctor/dashboard');
        } else {
          navigate('/patient/dashboard');
        }
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="w-8 h-1 bg-teal-600 rounded-full mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Change Password</h2>
          <p className="text-gray-400 text-sm mb-8">Update your account password</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-5 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-xl mb-5 text-sm">
              {success} Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                value={form.current_password}
                onChange={(e) => setForm({...form, current_password: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-sm"
                placeholder="Enter current password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                value={form.new_password}
                onChange={(e) => setForm({...form, new_password: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-sm"
                placeholder="Enter new password"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                value={form.confirm_password}
                onChange={(e) => setForm({...form, confirm_password: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-teal-400 bg-gray-50 focus:bg-white transition-all text-sm"
                placeholder="Confirm new password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-semibold hover:bg-teal-700 transition disabled:opacity-60 text-sm mt-2"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full bg-gray-100 text-gray-600 py-3.5 rounded-xl font-semibold hover:bg-gray-200 transition text-sm"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}