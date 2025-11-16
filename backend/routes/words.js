import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth.js';
import { getWordInfo } from '../services/gemini.js';
import { calculateNextReview, isDueForReview, sortByPriority } from '../services/srs.js';

const router = express.Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authMiddleware);

// Add a new word (uses Gemini API)
router.post('/add', async (req, res) => {
  try {
    const { word } = req.body;

    if (!word || word.trim() === '') {
      return res.status(400).json({ error: 'Word is required' });
    }

    // Check if word already exists for this user
    const existingWord = await prisma.word.findFirst({
      where: {
        userId: req.userId,
        word: {
          equals: word.trim(),
          mode: 'insensitive'
        }
      }
    });

    if (existingWord) {
      return res.status(400).json({ error: 'This word already exists in your vocabulary' });
    }

    // Fetch word information from Gemini API
    const wordInfo = await getWordInfo(word.trim());

    // Create word with SRS parameters
    const newWord = await prisma.word.create({
      data: {
        word: word.trim(),
        meaning: wordInfo.meaning,
        synonyms: wordInfo.synonyms,
        usageExample: wordInfo.usageExample,
        userId: req.userId,
        // SRS defaults are set in schema
      }
    });

    res.status(201).json({
      message: 'Word added successfully',
      word: newWord
    });
  } catch (error) {
    console.error('Add word error:', error);
    res.status(500).json({ error: error.message || 'Error adding word' });
  }
});

// Get all words for the user
router.get('/all', async (req, res) => {
  try {
    const { search } = req.query;

    let whereClause = { userId: req.userId };

    // Add search functionality
    if (search && search.trim() !== '') {
      whereClause = {
        userId: req.userId,
        OR: [
          { word: { contains: search.trim(), mode: 'insensitive' } },
          { meaning: { contains: search.trim(), mode: 'insensitive' } },
          { synonyms: { has: search.trim().toLowerCase() } }
        ]
      };
    }

    const words = await prisma.word.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      words,
      total: words.length
    });
  } catch (error) {
    console.error('Get words error:', error);
    res.status(500).json({ error: 'Error fetching words' });
  }
});

// Get words due for review
router.get('/review/due', async (req, res) => {
  try {
    const allWords = await prisma.word.findMany({
      where: { userId: req.userId }
    });

    // Filter words that are due for review
    const dueWords = allWords.filter(word => isDueForReview(word));

    // Sort by priority
    const sortedWords = sortByPriority(dueWords);

    res.json({
      words: sortedWords,
      total: sortedWords.length
    });
  } catch (error) {
    console.error('Get due words error:', error);
    res.status(500).json({ error: 'Error fetching words for review' });
  }
});

// Get a single word for review
router.get('/review/next', async (req, res) => {
  try {
    const allWords = await prisma.word.findMany({
      where: { userId: req.userId }
    });

    const dueWords = allWords.filter(word => isDueForReview(word));
    const sortedWords = sortByPriority(dueWords);

    if (sortedWords.length === 0) {
      return res.json({ word: null, message: 'No words due for review' });
    }

    res.json({ word: sortedWords[0] });
  } catch (error) {
    console.error('Get next word error:', error);
    res.status(500).json({ error: 'Error fetching next word' });
  }
});

// Update word after review (SRS algorithm)
router.post('/review/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { quality } = req.body;

    // Validate quality rating
    if (quality === undefined || quality < 0 || quality > 5) {
      return res.status(400).json({ error: 'Quality must be a number between 0 and 5' });
    }

    // Get the word
    const word = await prisma.word.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });

    if (!word) {
      return res.status(404).json({ error: 'Word not found' });
    }

    // Calculate next review using SRS algorithm
    const srsUpdate = calculateNextReview(word, quality);

    // Update the word
    const updatedWord = await prisma.word.update({
      where: { id },
      data: srsUpdate
    });

    res.json({
      message: 'Review recorded successfully',
      word: updatedWord,
      nextReviewIn: srsUpdate.interval
    });
  } catch (error) {
    console.error('Review word error:', error);
    res.status(500).json({ error: 'Error recording review' });
  }
});

// Get word statistics
router.get('/stats', async (req, res) => {
  try {
    const totalWords = await prisma.word.count({
      where: { userId: req.userId }
    });

    const allWords = await prisma.word.findMany({
      where: { userId: req.userId }
    });

    const dueWords = allWords.filter(word => isDueForReview(word));
    const reviewedWords = allWords.filter(word => word.lastReviewed !== null);

    res.json({
      total: totalWords,
      dueForReview: dueWords.length,
      reviewed: reviewedWords.length,
      notReviewed: totalWords - reviewedWords.length
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Error fetching statistics' });
  }
});

// Delete a word
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const word = await prisma.word.findFirst({
      where: {
        id,
        userId: req.userId
      }
    });

    if (!word) {
      return res.status(404).json({ error: 'Word not found' });
    }

    await prisma.word.delete({
      where: { id }
    });

    res.json({ message: 'Word deleted successfully' });
  } catch (error) {
    console.error('Delete word error:', error);
    res.status(500).json({ error: 'Error deleting word' });
  }
});

export default router;
