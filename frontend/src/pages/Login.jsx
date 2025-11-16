import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login({ email, password });
      login(response.data.token, response.data.user);
      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to login. Please try again."
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
            Welcome Back!
          </h2>
          <p className="text-center mb-6 text-gray-600 dark:text-gray-400">
            Login to continue learning
          </p>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-200 dark:border-red-900/40 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100 text-sm">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg text-base transition-all bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100 text-sm">
                Password
              </label>
              <input
                type="password"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg text-base transition-all bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-black font-medium px-6 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-indigo-500 hover:text-indigo-600 font-medium"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
