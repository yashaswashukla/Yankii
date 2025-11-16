import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wordAPI } from '../api/api';

const AddWord = () => {
  const [word, setWord] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [wordData, setWordData] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word.trim()) {
      setError('Please enter a word');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    setWordData(null);

    try {
      const response = await wordAPI.addWord(word.trim());
      setWordData(response.data.word);
      setSuccess(true);
      setWord('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add word. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = () => {
    setSuccess(false);
    setWordData(null);
    setWord('');
  };

  return (
    <div className="container py-4">
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h1 className="mb-4">Add New Word</h1>

        {!success ? (
          <div className="card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Enter a word</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., serendipity, ephemeral, ubiquitous..."
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  disabled={loading}
                  autoFocus
                />
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  Our AI will automatically fetch the meaning, synonyms, and usage example
                </p>
              </div>

              {error && <div className="alert alert-error">{error}</div>}

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                disabled={loading}
                style={{ width: '100%' }}
              >
                {loading ? 'Adding word...' : 'Add Word'}
              </button>
            </form>

            {loading && (
              <div className="mt-4">
                <div className="alert alert-info">
                  ⏳ Fetching word information from AI... This may take a few seconds.
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="alert alert-success">
              ✅ Word added successfully to your vocabulary!
            </div>

            {wordData && (
              <div className="card mt-3">
                <h2 className="card-title" style={{ color: 'var(--primary-color)', fontSize: '2rem' }}>
                  {wordData.word}
                </h2>

                <div className="mb-3">
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Meaning:
                  </h3>
                  <p style={{ color: 'var(--text-primary)' }}>{wordData.meaning}</p>
                </div>

                <div className="mb-3">
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Synonyms:
                  </h3>
                  <div className="word-synonyms">
                    {wordData.synonyms.map((synonym, index) => (
                      <span key={index} className="synonym-tag">
                        {synonym}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-3">
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    Usage Example:
                  </h3>
                  <div className="word-example">{wordData.usageExample}</div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '1rem',
                    marginTop: '1.5rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <button onClick={handleAddAnother} className="btn btn-primary">
                    ➕ Add Another Word
                  </button>
                  <button
                    onClick={() => navigate('/words')}
                    className="btn btn-secondary"
                  >
                    📖 View All Words
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="btn btn-secondary"
                  >
                    🏠 Back to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddWord;
