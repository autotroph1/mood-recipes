const moodStep = document.getElementById('mood-step');
const recipeStep = document.getElementById('recipe-step');
const moodButtons = document.getElementById('mood-buttons');
const backBtn = document.getElementById('back-btn');
const newRecipeBtn = document.getElementById('new-recipe-btn');

let currentMood = null;
let excludedIds = [];

const moodLabels = {
  happy: '😊 Happy',
  sad: '😢 Sad',
  stressed: '😰 Stressed',
  energetic: '⚡ Energetic',
  cozy: '🧣 Cozy',
  romantic: '❤️ Romantic',
  adventurous: '🌶️ Adventurous'
};

async function loadMoods() {
  const res = await fetch('/api/moods');
  const moods = await res.json();
  moodButtons.innerHTML = moods.map(mood => `
    <button class="mood-btn px-4 py-2 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 font-medium transition" data-mood="${mood}">
      ${moodLabels[mood] || mood}
    </button>
  `).join('');

  moodButtons.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => selectMood(btn.dataset.mood));
  });
}

async function fetchRecipe(mood, exclude = []) {
  const params = new URLSearchParams();
  if (exclude.length) params.set('exclude', exclude.join(','));
  const res = await fetch(`/api/recipes/${mood}${params.toString() ? '?' + params : ''}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function showRecipe(recipe) {
  document.getElementById('recipe-name').textContent = recipe.name;
  document.getElementById('recipe-desc').textContent = recipe.description || '';
  document.getElementById('recipe-ingredients').textContent = recipe.ingredients;
  document.getElementById('recipe-instructions').textContent = recipe.instructions;

  excludedIds.push(recipe.id);
  moodStep.classList.add('hidden');
  recipeStep.classList.remove('hidden');
}

function selectMood(mood) {
  currentMood = mood;
  excludedIds = [];
  fetchRecipe(mood)
    .then(showRecipe)
    .catch(err => alert('Could not load recipe. Try again.'));
}

function getNewRecipe() {
  fetchRecipe(currentMood, excludedIds)
    .then(showRecipe)
    .catch(() => alert('No more recipes for this mood! Try a different mood.'));
}

function goBack() {
  currentMood = null;
  excludedIds = [];
  recipeStep.classList.add('hidden');
  moodStep.classList.remove('hidden');
}

backBtn.addEventListener('click', goBack);
newRecipeBtn.addEventListener('click', getNewRecipe);

loadMoods();
