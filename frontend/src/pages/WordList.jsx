import React, { useState, useEffect } from "react";
import { wordAPI } from "../api/api";
import PronunciationButton from "../components/PronunciationButton";

const WordList = () => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [expandedCard, setExpandedCard] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [updating, setUpdating] = useState(null);

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

  const handleUpdateWord = async (id) => {
    setUpdating(id);
    try {
      const response = await wordAPI.updateWordFields(id);
      // Update the word in the list
      setWords(words.map(word => 
        word.id === id ? response.data.word : word
      ));
    } catch (error) {
      console.error("Error updating word:", error);
      alert("Failed to update word. Please try again.");
    } finally {
      setUpdating(null);
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

  const needsUpdate = (word) => {
    return !word.antonyms || word.antonyms.length === 0 || !word.phonetic;
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-7xl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          My Vocabulary
        </h1>

        <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm mb-6">
          <form onSubmit={handleSearch}>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <input
                type="text"
                className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg text-base transition-all bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="Search words..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-indigo-500 hover:bg-indigo-600 text-black font-medium px-4 py-2.5 rounded-lg transition-all text-sm"
                >
                  🔍
                </button>
                {search && (
                  <button
                    type="button"
                    className="bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-zinc-800 font-medium px-4 py-2.5 rounded-lg transition-all text-sm"
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
          <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-12 shadow-sm text-center">
            <h3 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
              {search ? "No words found" : "No words yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {search
                ? "Try a different search term"
                : "Start building your vocabulary!"}
            </p>
            {!search && (
              <a
                href="/add"
                className="inline-flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-black font-medium px-6 py-3 rounded-lg transition-all"
              >
                ➕ Add Your First Word
              </a>
            )}
          </div>
        ) : (
          <div>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {words.length} word{words.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {words.map((word) => (
                <div
                  key={word.id}
                  className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden transition-all hover:border-indigo-500 hover:shadow-md hover:-translate-y-0.5 flex flex-col"
                >
                  <div
                    className={`p-5 ${
                      isMobile ? "cursor-pointer select-none" : ""
                    }`}
                    onClick={() => toggleCard(word.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-2xl font-semibold text-indigo-500 dark:text-indigo-400">
                          {word.word}
                        </h3>
                        <PronunciationButton 
                          word={word.word}
                          audioUrl={word.audioUrl}
                          phonetic={word.phonetic}
                        />
                      </div>
                      {isMobile && (
                        <span className="text-gray-500 dark:text-gray-400 text-base transition-transform ml-2">
                          {isExpanded(word.id) ? "▼" : "▶"}
                        </span>
                      )}
                    </div>
                    {!isExpanded(word.id) && (
                      <p className="text-gray-900 dark:text-gray-100 text-sm line-clamp-2">
                        {word.meaning}
                      </p>
                    )}
                  </div>

                  {isExpanded(word.id) && (
                    <div className="px-5 pb-5 border-t border-gray-200 dark:border-zinc-800 slide-down flex-1 flex flex-col">
                      <div className="mt-4">
                        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                          Meaning
                        </h4>
                        <p className="text-gray-900 dark:text-gray-100 leading-relaxed text-sm">
                          {word.meaning}
                        </p>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                          Synonyms
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {word.synonyms.map((synonym, index) => (
                            <span
                              key={index}
                              className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-full text-xs border border-green-200 dark:border-green-900/40 transition-all hover:border-green-500"
                            >
                              {synonym}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                          Antonyms
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {word.antonyms && word.antonyms.length > 0 ? (
                            word.antonyms.map((antonym, index) => (
                              <span
                                key={index}
                                className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full text-xs border border-red-200 dark:border-red-900/40 transition-all hover:border-red-500"
                              >
                                {antonym}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500 text-xs italic">
                              Not available
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                          Example
                        </h4>
                        <div className="italic text-gray-600 dark:text-gray-400 p-3.5 bg-gray-50 dark:bg-black rounded-lg border-l-4 border-indigo-500 text-sm leading-relaxed">
                          {word.usageExample}
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-2">
                          Progress
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Reviews:
                            </span>
                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {word.repetitions}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Interval:
                            </span>
                            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                              {word.interval}d
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Next:
                            </span>
                            <span
                              className={`text-lg font-semibold ${
                                new Date(word.nextReviewDate) <= new Date()
                                  ? "text-red-500"
                                  : "text-green-500"
                              }`}
                            >
                              {formatDate(word.nextReviewDate)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-col gap-2">
                        {needsUpdate(word) && (
                          <button
                            onClick={() => handleUpdateWord(word.id)}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-medium py-2.5 px-4 rounded-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={updating === word.id}
                          >
                            {updating === word.id ? "Updating..." : "🔄 Add Antonyms & Pronunciation"}
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(word.id)}
                          className="w-full bg-red-500 hover:bg-red-600 text-black font-medium py-2.5 px-4 rounded-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={deleting === word.id}
                        >
                          {deleting === word.id ? "Deleting..." : "🗑️ Delete"}
                        </button>
                      </div>
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
