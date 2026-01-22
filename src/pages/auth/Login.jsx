import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import Input from "../../components/ui/Input";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Demo login (replace with API later)
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT SECTION */}
      <div className="w-full lg:w-3/5 bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center p-8 order-2 lg:order-1">
        <div className="text-center text-white max-w-2xl">
          <div className="mb-8 inline-block">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
              <LogIn size={40} className="text-white" />
            </div>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            BuildHub Admin Panel
          </h1>

          <p className="text-lg text-white/90">
            Manage vendors, materials, bookings and transactions efficiently
          </p>

          <div className="h-1 w-24 bg-white/40 mx-auto mt-8 rounded-full" />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="w-full lg:w-2/5 bg-gray-50 flex items-center justify-center p-6 lg:p-12 order-1 lg:order-2">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Admin Login
              </h2>
              <p className="text-gray-500 text-sm">
                Sign in to continue to your account
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
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

              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                icon={<Lock size={18} />}
              />

              {/* Options */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 accent-orange-400"
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    Remember me
                  </span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm text-orange-400 hover:text-orange-500 font-semibold"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-6 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <LogIn size={20} />
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-xs text-gray-500 mb-4 font-medium">
                Demo Credentials
              </p>
              <div className="space-y-2 bg-orange-50 p-4 rounded-lg border border-orange-100">
                <p className="text-xs text-gray-700">
                  <span className="font-semibold text-orange-600">Email:</span>
                  <code className="ml-2 bg-white px-2 py-1 rounded text-orange-700 font-mono">
                    admin@example.com
                  </code>
                </p>
                <p className="text-xs text-gray-700">
                  <span className="font-semibold text-orange-600">Password:</span>
                  <code className="ml-2 bg-white px-2 py-1 rounded text-orange-700 font-mono">
                    any password
                  </code>
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
