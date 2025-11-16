import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { wordAPI } from "../api/api";

const AddWord = () => {
  const [word, setWord] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [wordData, setWordData] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word.trim()) {
      setError("Please enter a word");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);
    setWordData(null);

    try {
      const response = await wordAPI.addWord(word.trim());
      setWordData(response.data.word);
      setSuccess(true);
      setWord("");
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to add word. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnother = () => {
    setSuccess(false);
    setWordData(null);
    setWord("");
  };

  return (
    <div className="container mx-auto px-4 py-4 max-w-7xl">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          Add New Word
        </h1>

        {!success ? (
          <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block mb-2 font-medium text-gray-900 dark:text-gray-100 text-sm">
                  Enter a word
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-lg text-base transition-all bg-white dark:bg-zinc-950 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="e.g., serendipity, ephemeral, ubiquitous..."
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  disabled={loading}
                  autoFocus
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Our AI will automatically fetch the meaning, synonyms, and
                  usage example
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-200 dark:border-red-900/40 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-black font-medium px-6 py-3.5 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Adding word..." : "Add Word"}
              </button>
            </form>

            {loading && (
              <div className="mt-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 text-indigo-500 border border-blue-200 dark:border-blue-900/40 px-4 py-3 rounded-lg text-sm">
                  ⏳ Fetching word information from AI... This may take a few
                  seconds.
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="bg-green-50 dark:bg-green-900/20 text-green-500 border border-green-200 dark:border-green-900/40 px-4 py-3 rounded-lg mb-6 text-sm">
              ✅ Word added successfully to your vocabulary!
            </div>

            {wordData && (
              <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-3xl font-bold text-indigo-500 dark:text-indigo-400 mb-6">
                  {wordData.word}
                </h2>

                <div className="mb-6">
                  <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Meaning:
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100">
                    {wordData.meaning}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Synonyms:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {wordData.synonyms.map((synonym, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 dark:bg-zinc-900 text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-full text-sm border border-gray-200 dark:border-zinc-700"
                      >
                        {synonym}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    Usage Example:
                  </h3>
                  <div className="italic text-gray-600 dark:text-gray-400 p-3.5 bg-gray-50 dark:bg-black rounded-lg border-l-4 border-indigo-500">
                    {wordData.usageExample}
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-6">
                  <button
                    onClick={handleAddAnother}
                    className="bg-indigo-500 hover:bg-indigo-600 text-black font-medium px-6 py-3 rounded-lg transition-all inline-flex items-center justify-center gap-2"
                  >
                    ➕ Add Another Word
                  </button>
                  <button
                    onClick={() => navigate("/words")}
                    className="bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-zinc-800 font-medium px-6 py-3 rounded-lg transition-all inline-flex items-center justify-center gap-2"
                  >
                    📖 View All Words
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-zinc-800 font-medium px-6 py-3 rounded-lg transition-all inline-flex items-center justify-center gap-2"
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
