import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { wordAPI } from "../api/api";
import PronunciationButton from "../components/PronunciationButton";

const Review = () => {
  const [currentWord, setCurrentWord] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [message, setMessage] = useState("");
  const [addingWord, setAddingWord] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNextWord();
  }, []);

  const fetchNextWord = async () => {
    setLoading(true);
    setShowAnswer(false);
    setMessage("");
    setNotification(null);
    try {
      const response = await wordAPI.getNextWord();
      if (response.data.word) {
        setCurrentWord(response.data.word);
      } else {
        setCurrentWord(null);
        setMessage(response.data.message || "No words due for review!");
      }
    } catch (error) {
      console.error("Error fetching word:", error);
      setMessage("Failed to load word. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const titleCase = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const handleQualityRating = async (quality) => {
    if (!currentWord || reviewing) return;

    setReviewing(true);
    try {
      await wordAPI.reviewWord(currentWord.id, quality);
      await fetchNextWord();
    } catch (error) {
      console.error("Error submitting review:", error);
      setMessage("Failed to submit review. Please try again.");
    } finally {
      setReviewing(false);
    }
  };

  const handleAddRelatedWord = async (relatedWord, e) => {
    e.stopPropagation(); // Prevent card click
    setAddingWord(relatedWord);
    setNotification(null);

    try {
      await wordAPI.addWord(relatedWord);
      setNotification({ type: 'success', message: `"${relatedWord}" added!` });
    } catch (err) {
      if (err.response?.data?.error?.includes('already exists')) {
        setNotification({ type: 'info', message: `"${relatedWord}" already in list` });
      } else {
        setNotification({ type: 'error', message: `Failed to add "${relatedWord}"` });
      }
    } finally {
      setAddingWord(null);
      setTimeout(() => setNotification(null), 2500);
    }
  };

  const qualityOptions = [
    { value: 0, label: "0 - Complete blackout", color: "danger" },
    { value: 1, label: "1 - Wrong, but familiar", color: "danger" },
    { value: 2, label: "2 - Wrong, but remembered", color: "warning" },
    { value: 3, label: "3 - Correct with effort", color: "warning" },
    { value: 4, label: "4 - Correct with hesitation", color: "success" },
    { value: 5, label: "5 - Perfect recall", color: "success" },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!currentWord) {
    return (
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="max-w-2xl mx-auto my-12 text-center">
          <div className="bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-8 shadow-sm">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              🎉 All Caught Up!
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              {message}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => navigate("/add")}
                className="bg-indigo-500 hover:bg-indigo-600 text-black font-medium px-6 py-3 rounded-lg transition-all inline-flex items-center justify-center gap-2"
              >
                ➕ Add New Words
              </button>
              <button
                onClick={() => navigate("/")}
                className="bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:hover:bg-zinc-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-zinc-800 font-medium px-6 py-3 rounded-lg transition-all inline-flex items-center justify-center gap-2"
              >
                🏠 Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-7xl">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
          Review Session
        </h1>

        {/* Notification Toast */}
        {notification && (
          <div className={`mb-4 px-4 py-2 rounded-lg text-sm border text-center ${
            notification.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/40'
              : notification.type === 'info'
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/40'
              : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/40'
          }`}>
            {notification.message}
          </div>
        )}

        {message && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-200 dark:border-red-900/40 px-4 py-3 rounded-lg mb-6 text-sm">
            {message}
          </div>
        )}

        <div className="max-w-2xl mx-auto my-8 perspective-1000">
          <div
            className={`bg-white dark:bg-zinc-950 border-2 border-gray-200 dark:border-zinc-800 rounded-2xl p-8 md:p-12 shadow-lg min-h-[300px] flex flex-col justify-center items-center text-center transition-all hover:-translate-y-1 hover:shadow-2xl ${
              !showAnswer ? "cursor-pointer" : ""
            } hover:border-indigo-500`}
            onClick={() => !showAnswer && setShowAnswer(true)}
          >
            {!showAnswer ? (
              <div>
                <div className="text-4xl md:text-5xl font-bold text-indigo-500 dark:text-indigo-400 mb-8">
                  {titleCase(currentWord.word)}
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-base">
                  Click to reveal
                </p>
              </div>
            ) : (
              <div className="w-full text-left space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <h2 className="text-2xl font-bold text-indigo-500 dark:text-indigo-400">
                      {titleCase(currentWord.word)}
                    </h2>
                    <PronunciationButton 
                      word={currentWord.word}
                      audioUrl={currentWord.audioUrl}
                      phonetic={currentWord.phonetic}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-500 dark:text-indigo-400">
                    Meaning:
                  </h3>
                  <p className="text-gray-900 dark:text-gray-100">
                    {currentWord.meaning}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-500 dark:text-indigo-400">
                    Synonyms:
                    <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-2">
                      (click to add)
                    </span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {currentWord.synonyms.map((synonym, index) => (
                      <button
                        key={index}
                        onClick={(e) => handleAddRelatedWord(synonym, e)}
                        disabled={addingWord === synonym}
                        className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-3 py-1.5 rounded-full text-sm border border-green-200 dark:border-green-900/40 hover:bg-green-100 dark:hover:bg-green-900/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                        title={`Click to add "${synonym}"`}
                      >
                        {addingWord === synonym ? '⏳' : '+'} {synonym}
                      </button>
                    ))}
                  </div>
                </div>

                {currentWord.antonyms && currentWord.antonyms.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-indigo-500 dark:text-indigo-400">
                      Antonyms:
                      <span className="text-xs font-normal text-gray-500 dark:text-gray-400 ml-2">
                        (click to add)
                      </span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {currentWord.antonyms.map((antonym, index) => (
                        <button
                          key={index}
                          onClick={(e) => handleAddRelatedWord(antonym, e)}
                          disabled={addingWord === antonym}
                          className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-full text-sm border border-red-200 dark:border-red-900/40 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-wait"
                          title={`Click to add "${antonym}"`}
                        >
                          {addingWord === antonym ? '⏳' : '+'} {antonym}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-semibold mb-2 text-indigo-500 dark:text-indigo-400">
                    Usage:
                  </h3>
                  <div className="italic text-gray-600 dark:text-gray-400 p-3.5 bg-gray-50 dark:bg-black rounded-lg border-l-4 border-indigo-500">
                    {currentWord.usageExample}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {showAnswer && (
          <div>
            <h3 className="text-center mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
              How well did you remember?
            </h3>
            <p className="text-center mb-6 text-gray-600 dark:text-gray-400">
              Rate your recall from 0 (didn't remember) to 5 (perfect recall)
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
              {qualityOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleQualityRating(option.value)}
                  className={`p-4 rounded-lg border-2 transition-all hover:-translate-y-0.5 hover:shadow-md font-medium disabled:opacity-50 disabled:cursor-not-allowed ${
                    option.value <= 1
                      ? "border-red-500 text-red-500 hover:bg-red-500 dark:hover:bg-red-500 hover:text-black"
                      : option.value <= 3
                      ? "border-amber-500 text-amber-500 hover:bg-amber-500 dark:hover:bg-amber-500 hover:text-black"
                      : "border-green-500 text-green-500 hover:bg-green-500 dark:hover:bg-green-500 hover:text-black"
                  } bg-white dark:bg-zinc-950`}
                  disabled={reviewing}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {reviewing && (
          <div className="mt-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 text-indigo-500 border border-blue-200 dark:border-blue-900/40 px-4 py-3 rounded-lg text-center text-sm">
              ⏳ Recording your response...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Review;
