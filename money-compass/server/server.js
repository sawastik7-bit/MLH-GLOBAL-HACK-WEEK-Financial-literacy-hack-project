const express = require('express');
const path = require('path');
const { analyzeFinances } = require('./financeEngine');
const { GLOSSARY } = require('./glossary');
const { QUIZ_QUESTIONS } = require('./quiz');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Simple in-memory token-bucket rate limiter
const buckets = new Map();
const RATE_CAPACITY = 30;
const RATE_REFILL_PER_SEC = 0.5;

function rateLimit(req, res, next) {
  const key = req.ip || 'anon';
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket) {
    bucket = { tokens: RATE_CAPACITY, last: now };
    buckets.set(key, bucket);
  }

  const elapsedSec = (now - bucket.last) / 1000;
  bucket.tokens = Math.min(RATE_CAPACITY, bucket.tokens + elapsedSec * RATE_REFILL_PER_SEC);
  bucket.last = now;

  if (bucket.tokens < 1) {
    return res.status(429).json({ error: 'Too many requests. Please slow down.' });
  }

  bucket.tokens -= 1;
  next();
}

app.use('/api', rateLimit);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'money-compass' });
});

app.post('/api/analyze', (req, res) => {
  try {
    const { income, expenses, totalDebt, emergencyFund } = req.body || {};

    if (typeof income !== 'number' || income < 0) {
      return res.status(400).json({ error: 'income must be a non-negative number' });
    }
    if (expenses && typeof expenses !== 'object') {
      return res.status(400).json({ error: 'expenses must be an object of category -> amount' });
    }

    const result = analyzeFinances({
      income,
      expenses: expenses || {},
      totalDebt: totalDebt || 0,
      emergencyFund: emergencyFund || 0,
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to analyze finances' });
  }
});

app.get('/api/glossary', (req, res) => {
  const { term } = req.query;
  if (term) {
    const key = Object.keys(GLOSSARY).find(
      (k) => k.toLowerCase() === String(term).toLowerCase()
    );
    if (!key) return res.status(404).json({ error: `No glossary entry for "${term}"` });
    return res.json({ term: key, definition: GLOSSARY[key] });
  }
  res.json({ terms: GLOSSARY });
});

app.get('/api/quiz', (req, res) => {
  const questions = QUIZ_QUESTIONS.map(({ id, question, options }) => ({ id, question, options }));
  res.json({ questions });
});

app.post('/api/quiz/grade', (req, res) => {
  const { answers } = req.body || {};
  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'answers must be an object of questionId -> optionIndex' });
  }

  let correct = 0;
  const results = QUIZ_QUESTIONS.map((q) => {
    const userAnswer = answers[q.id];
    const isCorrect = userAnswer === q.correctIndex;
    if (isCorrect) correct += 1;
    return {
      id: q.id,
      correct: isCorrect,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    };
  });

  res.json({ score: correct, total: QUIZ_QUESTIONS.length, results });
});

app.use(express.static(path.join(__dirname, '..', 'public')));

app.listen(PORT, () => {
  console.log(`Money Compass running on http://localhost:${PORT}`);
});

module.exports = app;