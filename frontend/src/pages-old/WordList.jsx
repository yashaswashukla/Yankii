import React, { useState, useEffect } from "react";
import { wordAPI } from "../api/api";

const WordList = () => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchWords();
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  const fetchWords = async (searchQuery = "") => {
    setLoading(true);
    try {
      const response = await wordAPI.getAllWords(searchQuery);
      setWords(response.data.words);
    } catch (error) {
      console.error("Error fetching words:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWords(search);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this word?")) {
      return;
    }

    setDeleting(id);
    try {
      await wordAPI.deleteWord(id);
      setWords(words.filter((word) => word.id !== id));
    } catch (error) {
      console.error("Error deleting word:", error);
      alert("Failed to delete word. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)}d overdue`;
    } else if (diffDays === 0) {
      return "Due today";
    } else {
      return `In ${diffDays}d`;
    }
  };

  const toggleCard = (id) => {
    if (isMobile) {
      setExpandedCard(expandedCard === id ? null : id);
    }
  };

  const isExpanded = (id) => {
    return !isMobile || expandedCard === id;
  };

  return (
    <div className="container py-4">
      <div className="word-list-container">
        <h1 className="page-title">My Vocabulary</h1>

        <div className="card search-card">
          <form onSubmit={handleSearch}>
            <div className="search-wrapper">
              <input
                type="text"
                className="form-input"
                placeholder="Search words..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="search-buttons">
                <button type="submit" className="btn btn-primary btn-sm">
                  🔍
                </button>
                {search && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setSearch("");
                      fetchWords("");
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : words.length === 0 ? (
          <div className="card text-center empty-state">
            <h3 className="empty-title">
              {search ? "No words found" : "No words yet"}
            </h3>
            <p className="empty-text">
              {search
                ? "Try a different search term"
                : "Start building your vocabulary!"}
            </p>
            {!search && (
              <a href="/add" className="btn btn-primary">
                ➕ Add Your First Word
              </a>
            )}
          </div>
        ) : (
          <div>
            <p className="word-count">
              {words.length} word{words.length !== 1 ? "s" : ""}
            </p>
            <div className="word-grid">
              {words.map((word) => (
                <div key={word.id} className="word-card">
                  {/* Header - clickable only on mobile */}
                  <div
                    className={`word-card-header ${
                      isMobile ? "clickable" : ""
                    }`}
                    onClick={() => toggleCard(word.id)}
                  >
                    <div className="word-header-content">
                      <h3 className="word-title">{word.word}</h3>
                      {isMobile && (
                        <span className="word-expand-icon">
                          {isExpanded(word.id) ? "▼" : "▶"}
                        </span>
                      )}
                    </div>
                    {!isExpanded(word.id) && (
                      <p className="word-meaning-preview">{word.meaning}</p>
                    )}
                  </div>

                  {/* Content - always visible on desktop, collapsible on mobile */}
                  {isExpanded(word.id) && (
                    <div className="word-card-content">
                      <div className="word-section">
                        <h4 className="section-label">Meaning</h4>
                        <p className="word-meaning">{word.meaning}</p>
                      </div>

                      <div className="word-section">
                        <h4 className="section-label">Synonyms</h4>
                        <div className="word-synonyms">
                          {word.synonyms.map((synonym, index) => (
                            <span key={index} className="synonym-tag">
                              {synonym}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="word-section">
                        <h4 className="section-label">Example</h4>
                        <div className="word-example">{word.usageExample}</div>
                      </div>

                      <div className="word-section">
                        <h4 className="section-label">Progress</h4>
                        <div className="word-stats">
                          <div className="stat-item">
                            <span className="stat-label">Reviews:</span>
                            <span className="stat-value">
                              {word.repetitions}
                            </span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Interval:</span>
                            <span className="stat-value">
                              {word.interval} day
                              {word.interval !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Next Review:</span>
                            <span
                              className="stat-value"
                              style={{
                                color:
                                  new Date(word.nextReviewDate) <= new Date()
                                    ? "var(--danger-color)"
                                    : "var(--success-color)",
                              }}
                            >
                              {formatDate(word.nextReviewDate)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDelete(word.id)}
                        className="btn btn-danger btn-sm delete-btn"
                        disabled={deleting === word.id}
                      >
                        {deleting === word.id ? "Deleting..." : "🗑️ Delete"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WordList;
