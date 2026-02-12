const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const MOODS = ['happy', 'sad', 'stressed', 'energetic', 'cozy', 'romantic', 'adventurous'];

app.get('/api/moods', (req, res) => {
  res.json(MOODS);
});

app.get('/api/recipes/:mood', (req, res) => {
  const mood = req.params.mood.toLowerCase();
  const exclude = req.query.exclude ? req.query.exclude.split(',').map(Number) : [];

  if (!MOODS.includes(mood)) {
    return res.status(400).json({ error: 'Invalid mood' });
  }

  let query = 'SELECT * FROM recipes WHERE mood = ?';
  const params = [mood];

  if (exclude.length > 0) {
    query += ` AND id NOT IN (${exclude.map(() => '?').join(',')})`;
    params.push(...exclude);
  }

  const recipes = db.prepare(query).all(...params);

  if (recipes.length === 0) {
    return res.status(404).json({ error: 'No more recipes for this mood' });
  }

  const randomRecipe = recipes[Math.floor(Math.random() * recipes.length)];
  res.json(randomRecipe);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
