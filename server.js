const express = require('express');
const path = require('path');
const recipes = require('./data');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

const MOODS = ['happy', 'sad', 'stressed', 'energetic', 'cozy', 'romantic', 'adventurous'];
const MEAL_TYPES = ['breakfast', 'late breakfast', 'lunch', 'midday snack', 'evening snack', 'dinner', 'dessert', 'any'];

// Curated Unsplash food photos (free to use)
const RECIPE_IMAGES = [
  'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80',
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80',
  'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&q=80',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80',
  'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=600&q=80',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80',
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&q=80',
  'https://images.unsplash.com/photo-1579954112545-0e4e2122980e?w=600&q=80',
  'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=600&q=80',
  'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=600&q=80',
  'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80',
  'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80',
  'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80',
];

app.get('/api/moods', (req, res) => {
  res.json(MOODS);
});

app.get('/api/meal-types', (req, res) => {
  res.json(MEAL_TYPES);
});

app.get('/api/recipes/:mood', (req, res) => {
  const mood = req.params.mood.toLowerCase();
  const mealType = (req.query.mealType || '').toLowerCase();
  const exclude = req.query.exclude ? req.query.exclude.split(',').map(Number) : [];

  if (!MOODS.includes(mood)) {
    return res.status(400).json({ error: 'Invalid mood' });
  }

  const matchMood = (r) => (r.moods || [r.mood]).includes(mood);
  const matchMealType = (r) => {
    const types = r.mealTypes || [r.mealType].filter(Boolean);
    if (!mealType || mealType === 'any') return true;
    return types.includes(mealType) || types.includes('any');
  };

  let filtered = recipes.filter(r => {
    if (!matchMood(r) || exclude.includes(r.id)) return false;
    return matchMealType(r);
  });

  if (filtered.length === 0) {
    return res.status(404).json({ error: 'No more recipes for this mood and meal type' });
  }

  const randomRecipe = filtered[Math.floor(Math.random() * filtered.length)];
  randomRecipe.image = randomRecipe.image || RECIPE_IMAGES[randomRecipe.id % RECIPE_IMAGES.length];
  res.json(randomRecipe);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
