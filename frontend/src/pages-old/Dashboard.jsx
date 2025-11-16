import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { wordAPI } from '../api/api';

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
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 className="mb-4">
          Welcome back, {user?.name || user?.email}! 👋
        </h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats?.total || 0}</div>
            <div className="stat-label">Total Words</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.dueForReview || 0}</div>
            <div className="stat-label">Due for Review</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.reviewed || 0}</div>
            <div className="stat-label">Reviewed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.notReviewed || 0}</div>
            <div className="stat-label">Not Reviewed</div>
          </div>
        </div>

        <div className="card">
          <h2 className="card-title">Quick Actions</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
            }}
          >
            <Link to="/add" className="btn btn-primary btn-lg">
              ➕ Add New Word
            </Link>
            <Link
              to="/review"
              className="btn btn-secondary btn-lg"
              style={{
                backgroundColor: stats?.dueForReview > 0 ? 'var(--warning-color)' : '',
                color: stats?.dueForReview > 0 ? 'white' : '',
                border: 'none',
              }}
            >
              🎯 Review Words
              {stats?.dueForReview > 0 && ` (${stats.dueForReview})`}
            </Link>
            <Link to="/words" className="btn btn-secondary btn-lg">
              📖 View All Words
            </Link>
          </div>
        </div>

        <div className="card mt-4">
          <h2 className="card-title">How it Works</h2>
          <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <p style={{ marginBottom: '1rem' }}>
              <strong>1. Add Words:</strong> Enter any word and our AI will fetch its meaning,
              synonyms, and usage examples automatically.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong>2. Review with Flashcards:</strong> Review words using our spaced
              repetition system (SRS) which optimizes your learning.
            </p>
            <p style={{ marginBottom: '1rem' }}>
              <strong>3. Rate Your Recall:</strong> After reviewing, rate how well you
              remembered (0-5). The system will schedule the next review accordingly.
            </p>
            <p>
              <strong>4. Build Your Vocabulary:</strong> Track your progress and watch your
              vocabulary grow over time!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
