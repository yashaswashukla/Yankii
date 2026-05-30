import React, { useState } from 'react';

const PronunciationButton = ({ word, audioUrl, phonetic }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playPronunciation = async () => {
    if (isPlaying) return;
    setIsPlaying(true);

    try {
      // Try to play audio URL first (from dictionary API)
      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          // Fallback to Web Speech API if audio fails
          speakWord();
        };
        await audio.play();
      } else {
        // Use Web Speech API as fallback
        speakWord();
      }
    } catch (error) {
      console.error('Audio playback failed:', error);
      speakWord();
    }
  };

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      window.speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(false);
      alert('Speech synthesis not supported in this browser');
    }
  };

  return (
    <div className="inline-flex items-center gap-2">
      <button
        onClick={playPronunciation}
        disabled={isPlaying}
        className={`
          p-2 rounded-full transition-all
          ${isPlaying 
            ? 'bg-indigo-100 dark:bg-indigo-900/30 cursor-wait' 
            : 'bg-gray-100 dark:bg-zinc-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/30'
          }
          text-indigo-500 dark:text-indigo-400
          disabled:opacity-50
        `}
        title="Play pronunciation"
        aria-label={`Play pronunciation of ${word}`}
      >
        {isPlaying ? (
          <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      
      {phonetic && (
        <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
          {phonetic}
        </span>
      )}
    </div>
  );
};

export default PronunciationButton;
