/**
 * SRS (Spaced Repetition System) Algorithm - SM-2 Implementation
 * 
 * The SM-2 algorithm calculates when a card should be reviewed again
 * based on the user's performance (quality rating 0-5).
 * 
 * Quality ratings:
 * 0 - Complete blackout
 * 1 - Incorrect response, correct one seemed familiar
 * 2 - Incorrect response, correct one remembered
 * 3 - Correct response, but required significant effort
 * 4 - Correct response, after some hesitation
 * 5 - Perfect response, immediate recall
 */

export function calculateNextReview(currentWord, quality) {
  // Quality must be between 0 and 5
  quality = Math.max(0, Math.min(5, quality));

  let { easeFactor, interval, repetitions } = currentWord;

  // If quality < 3, reset the repetition count and interval
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    // Increment repetition count
    repetitions += 1;

    // Calculate new interval based on repetition number
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }

  // Update ease factor
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  
  // Ease factor should be at least 1.3
  easeFactor = Math.max(1.3, easeFactor);

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  return {
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    interval,
    repetitions,
    nextReviewDate,
    lastReviewed: new Date()
  };
}

/**
 * Get words that are due for review
 */
export function isDueForReview(word) {
  const now = new Date();
  const nextReview = new Date(word.nextReviewDate);
  return nextReview <= now;
}

/**
 * Sort words by priority (most urgent first)
 */
export function sortByPriority(words) {
  const now = new Date();
  
  return words.sort((a, b) => {
    const aDue = new Date(a.nextReviewDate) - now;
    const bDue = new Date(b.nextReviewDate) - now;
    
    // Words past due date come first
    if (aDue < 0 && bDue >= 0) return -1;
    if (bDue < 0 && aDue >= 0) return 1;
    
    // Among past due, earlier dates first
    if (aDue < 0 && bDue < 0) return aDue - bDue;
    
    // Among not due, later dates last
    return aDue - bDue;
  });
}
