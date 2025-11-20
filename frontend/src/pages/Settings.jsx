import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api/api-old";

const Settings = () => {
  const { user } = useAuth();
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
    // Clear messages when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      setError("New password must be different from current password");
      return;
    }

    setLoading(true);

    try {
      await authAPI.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setSuccess("Password updated successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to update password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-7xl">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Account Settings
        </h1>

        {/* User Info Card */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Profile Information
          </h2>
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 sm:w-24">
                Name:
              </span>
              <span className="text-gray-900 dark:text-gray-100">
                {user?.name || "Not set"}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400 sm:w-24">
                Email:
              </span>
              <span className="text-gray-900 dark:text-gray-100">
                {user?.email}
              </span>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Change Password
          </h2>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-200 dark:border-red-900/40 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-500 border border-green-200 dark:border-green-900/40 px-4 py-3 rounded-lg mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100 text-sm">
                Current Password
              </label>
              <input
                type="password"
                name="currentPassword"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg text-base transition-all bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Enter current password"
                value={passwordData.currentPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100 text-sm">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg text-base transition-all bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Enter new password (min 6 characters)"
                value={passwordData.newPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100 text-sm">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg text-base transition-all bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-black font-medium px-6 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>

        {/* Security Tips */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/40 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">
            🔒 Password Security Tips
          </h3>
          <ul className="text-sm text-blue-600 dark:text-blue-300 space-y-1">
            <li>• Use at least 6 characters</li>
            <li>• Include uppercase and lowercase letters</li>
            <li>• Add numbers and special characters</li>
            <li>• Avoid using personal information</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;
