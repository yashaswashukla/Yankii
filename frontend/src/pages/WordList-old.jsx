import React, { useState, useEffect } from "react";
import { wordAPI } from "../api/api";

const WordList = () => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchWords();
  }, []);

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
      return `${Math.abs(diffDays)} day${
        Math.abs(diffDays) !== 1 ? "s" : ""
      } overdue`;
    } else if (diffDays === 0) {
      return "Due today";
    } else {
      return `In ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    }
  };

  return (
    <div className="container py-4">
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <h1 className="mb-4">My Vocabulary</h1>

        <div className="card mb-4">
          <form onSubmit={handleSearch}>
            <div style={{ display: "flex", gap: "1rem" }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search by word, meaning, or synonym..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary">
                🔍 Search
              </button>
              {search && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSearch("");
                    fetchWords("");
                  }}
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : words.length === 0 ? (
          <div className="card text-center">
            <h3 style={{ marginBottom: "1rem" }}>
              {search ? "No words found" : "No words yet"}
            </h3>
            <p
              style={{ color: "var(--text-secondary)", marginBottom: "1.5rem" }}
            >
              {search
                ? "Try a different search term"
                : "Start building your vocabulary by adding words!"}
            </p>
            {!search && (
              <a
                href="/add"
                className="btn btn-primary"
                style={{ display: "inline-flex" }}
              >
                ➕ Add Your First Word
              </a>
            )}
          </div>
        ) : (
          <div>
            <p style={{ marginBottom: "1rem", color: "var(--text-secondary)" }}>
              Found {words.length} word{words.length !== 1 ? "s" : ""}
            </p>
            <div className="word-grid">
              {words.map((word) => (
                <div key={word.id} className="word-item">
                  <div className="word-header">
                    <h3 className="word-title">{word.word}</h3>
                    <button
                      onClick={() => handleDelete(word.id)}
                      className="btn btn-danger btn-sm"
                      disabled={deleting === word.id}
                      style={{ flexShrink: 0 }}
                    >
                      {deleting === word.id ? "Deleting..." : "🗑️ Delete"}
                    </button>
                  </div>

                  <p className="word-meaning">{word.meaning}</p>

                  <div className="word-synonyms">
                    {word.synonyms.map((synonym, index) => (
                      <span key={index} className="synonym-tag">
                        {synonym}
                      </span>
                    ))}
                  </div>

                  <div className="word-example">{word.usageExample}</div>

                  <div
                    style={{
                      marginTop: "1rem",
                      paddingTop: "1rem",
                      borderTop: "1px solid var(--border-color)",
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      flexWrap: "wrap",
                      gap: "0.5rem",
                    }}
                  >
                    <div>
                      <strong>Reviews:</strong> {word.repetitions}
                    </div>
                    <div>
                      <strong>Interval:</strong> {word.interval} day
                      {word.interval !== 1 ? "s" : ""}
                    </div>
                    <div>
                      <strong>Next Review:</strong>{" "}
                      <span
                        style={{
                          color:
                            new Date(word.nextReviewDate) <= new Date()
                              ? "var(--danger-color)"
                              : "var(--success-color)",
                          fontWeight: "600",
                        }}
                      >
                        {formatDate(word.nextReviewDate)}
                      </span>
                    </div>
                  </div>
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
