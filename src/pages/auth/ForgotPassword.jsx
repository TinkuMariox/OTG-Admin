import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("If this email exists, a reset link has been sent.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-2">Forgot Password</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter your registered email address
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600"
          >
            Send Reset Link
          </button>
        </form>

        {message && (
          <p className="text-green-600 text-sm mt-4 text-center">
            {message}
          </p>
        )}

        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-sm text-orange-500 hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
