import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { wordAPI } from "../api/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await wordAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-7xl">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Welcome back, {user?.name || user?.email}! 👋
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-black p-6 rounded-xl shadow-md hover:-translate-y-0.5 transition-transform">
            <div className="text-3xl font-bold mb-1">{stats?.total || 0}</div>
            <div className="text-sm opacity-95">Total Words</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-black p-6 rounded-xl shadow-md hover:-translate-y-0.5 transition-transform">
            <div className="text-3xl font-bold mb-1">
              {stats?.dueForReview || 0}
            </div>
            <div className="text-sm opacity-95">Due for Review</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-black p-6 rounded-xl shadow-md hover:-translate-y-0.5 transition-transform">
            <div className="text-3xl font-bold mb-1">
              {stats?.reviewed || 0}
            </div>
            <div className="text-sm opacity-95">Reviewed</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-black p-6 rounded-xl shadow-md hover:-translate-y-0.5 transition-transform">
            <div className="text-3xl font-bold mb-1">
              {stats?.notReviewed || 0}
            </div>
            <div className="text-sm opacity-95">Not Reviewed</div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/add"
              className="bg-indigo-500 hover:bg-indigo-600 text-black font-semibold py-3 px-6 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-md text-center inline-flex items-center justify-center gap-2"
            >
              ➕ Add New Word
            </Link>
            <Link
              to="/review"
              className={`${
                stats?.dueForReview > 0
                  ? "bg-amber-500 hover:bg-amber-600 text-black"
                  : "bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-zinc-800"
              } font-medium py-3 px-6 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-md text-center inline-flex items-center justify-center gap-2`}
            >
              🎯 Review Words
              {stats?.dueForReview > 0 && ` (${stats.dueForReview})`}
            </Link>
            <Link
              to="/words"
              className="bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-zinc-800 font-medium py-3 px-6 rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-md text-center inline-flex items-center justify-center gap-2"
            >
              📖 View All Words
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
            How it Works
          </h2>
          <div className="text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
            <p>
              <strong className="text-gray-900 dark:text-gray-100">
                1. Add Words:
              </strong>{" "}
              Enter any word and our AI will fetch its meaning, synonyms, and
              usage examples automatically.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">
                2. Review with Flashcards:
              </strong>{" "}
              Review words using our spaced repetition system (SRS) which
              optimizes your learning.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">
                3. Rate Your Recall:
              </strong>{" "}
              After reviewing, rate how well you remembered (0-5). The system
              will schedule the next review accordingly.
            </p>
            <p>
              <strong className="text-gray-900 dark:text-gray-100">
                4. Build Your Vocabulary:
              </strong>{" "}
              Track your progress and watch your vocabulary grow over time!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
