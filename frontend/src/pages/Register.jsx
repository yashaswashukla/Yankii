import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      login(response.data.token, response.data.user);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to register. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-7xl">
      <div className="max-w-md mx-auto my-12">
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-center mb-2 text-gray-900 dark:text-gray-100">
            Create Account
          </h2>
          <p className="text-center mb-6 text-gray-600 dark:text-gray-400">
            Start your vocabulary learning journey
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-200 dark:border-red-900/40 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100 text-sm">
                Name
              </label>
              <input
                type="text"
                name="name"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg text-base transition-all bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100 text-sm">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg text-base transition-all bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100 text-sm">
                Password
              </label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg text-base transition-all bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100 text-sm">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg text-base transition-all bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-black font-medium px-6 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-500 hover:text-indigo-600 font-medium"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
