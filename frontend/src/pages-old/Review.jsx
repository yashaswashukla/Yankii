import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { wordAPI } from '../api/api';

const Review = () => {
  const [currentWord, setCurrentWord] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNextWord();
  }, []);

  const fetchNextWord = async () => {
    setLoading(true);
    setShowAnswer(false);
    setMessage('');
    try {
      const response = await wordAPI.getNextWord();
      if (response.data.word) {
        setCurrentWord(response.data.word);
      } else {
        setCurrentWord(null);
        setMessage(response.data.message || 'No words due for review!');
      }
    } catch (error) {
      console.error('Error fetching word:', error);
      setMessage('Failed to load word. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQualityRating = async (quality) => {
    if (!currentWord || reviewing) return;

    setReviewing(true);
    try {
      await wordAPI.reviewWord(currentWord.id, quality);
      // Fetch next word
      await fetchNextWord();
    } catch (error) {
      console.error('Error submitting review:', error);
      setMessage('Failed to submit review. Please try again.');
    } finally {
      setReviewing(false);
    }
  };

  const qualityOptions = [
    { value: 0, label: '0 - Complete blackout', color: 'danger' },
    { value: 1, label: '1 - Wrong, but familiar', color: 'danger' },
    { value: 2, label: '2 - Wrong, but remembered', color: 'warning' },
    { value: 3, label: '3 - Correct with effort', color: 'warning' },
    { value: 4, label: '4 - Correct with hesitation', color: 'success' },
    { value: 5, label: '5 - Perfect recall', color: 'success' },
  ];

  if (loading) {
    return (
      <div className="container py-4">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="container py-4">
        <div style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center' }}>
          <div className="card">
            <h2 className="card-title">🎉 All Caught Up!</h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
              {message}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/add')} className="btn btn-primary">
                ➕ Add New Words
              </button>
              <button onClick={() => navigate('/')} className="btn btn-secondary">
                🏠 Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 className="mb-4 text-center">Review Session</h1>

        {message && <div className="alert alert-error mb-3">{message}</div>}

        <div className="flashcard-container">
          <div
            className="flashcard"
            onClick={() => !showAnswer && setShowAnswer(true)}
            style={{ cursor: showAnswer ? 'default' : 'pointer' }}
          >
            {!showAnswer ? (
              <div>
                <div className="flashcard-word">{currentWord.word}</div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
                  Click to reveal
                </p>
              </div>
            ) : (
              <div className="flashcard-content">
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                    Meaning:
                  </h3>
                  <p>{currentWord.meaning}</p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                    Synonyms:
                  </h3>
                  <div className="word-synonyms">
                    {currentWord.synonyms.map((synonym, index) => (
                      <span key={index} className="synonym-tag">
                        {synonym}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
                    Usage:
                  </h3>
                  <div className="word-example" style={{ textAlign: 'left' }}>
                    {currentWord.usageExample}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {showAnswer && (
          <div>
            <h3 className="text-center mb-2" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
              How well did you remember?
            </h3>
            <p className="text-center mb-3" style={{ color: 'var(--text-secondary)' }}>
              Rate your recall from 0 (didn't remember) to 5 (perfect recall)
            </p>
            <div className="quality-buttons">
              {qualityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleQualityRating(option.value)}
                  className={`quality-btn quality-btn-${option.value}`}
                  disabled={reviewing}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {reviewing && (
          <div className="mt-3">
            <div className="alert alert-info text-center">
              ⏳ Recording your response...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;
