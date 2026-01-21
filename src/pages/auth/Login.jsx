import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import Input from '../../components/ui/Input';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length === 0) {
      navigate('/dashboard');
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Section - 60% on desktop, full width on mobile */}
      <div className="w-full lg:w-3/5 bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center p-8 order-2 lg:order-1">
        <div className="text-center text-white max-w-2xl">
          <div className="mb-8 inline-block">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
              <LogIn size={40} className="text-white" />
            </div>
          </div>
          
          {/* <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Construction Admin Panel
          </h1>
          
          <p className="text-xl lg:text-2xl text-white/90 mb-8 font-light">
            Manage vendors, materials, categories and platform settings
          </p> */}

          <div className="h-1 w-24 bg-white/40 mx-auto mb-8 rounded-full"></div>

          <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
            {/* <span>Admin Access Required</span>
            <ArrowRight size={16} /> */}
          </div>

          {/* Mobile only - bottom accent */}
          <div className="lg:hidden mt-12 flex gap-3 justify-center">
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
            <div className="w-2 h-2 bg-white rounded-full"></div>
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right Section - 40% on desktop, full width on mobile */}
      <div className="w-full lg:w-2/5 bg-gray-50 flex items-center justify-center p-6 lg:p-12 order-1 lg:order-2">
        <div className="w-full max-w-sm">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h2>
              <p className="text-gray-500 text-sm">Sign in to continue to your account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  icon={<Mail size={18} />}
                />
              </div>

              <div>
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  placeholder="••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  icon={<Lock size={18} />}
                />
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-gray-300 accent-orange-400 cursor-pointer" 
                  />
                  <span className="text-sm text-gray-700 font-medium">Remember me</span>
                </label>
                <a href="#" className="text-sm text-orange-400 hover:text-orange-500 font-semibold transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full mt-8 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <LogIn size={20} />
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-xs text-gray-500 mb-4 font-medium">Demo Credentials</p>
              <div className="space-y-2 bg-orange-50 p-4 rounded-lg border border-orange-100">
                <p className="text-xs text-gray-700">
                  <span className="font-semibold text-orange-600">Email:</span>
                  <code className="ml-2 bg-white px-2 py-1 rounded text-orange-700 font-mono">admin@example.com</code>
                </p>
                <p className="text-xs text-gray-700">
                  <span className="font-semibold text-orange-600">Password:</span>
                  <code className="ml-2 bg-white px-2 py-1 rounded text-orange-700 font-mono">any password</code>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-gray-500 mt-6">
            © 2024 BuildHub. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
