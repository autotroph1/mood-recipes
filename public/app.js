const selectStep = document.getElementById('select-step');
const recipeStep = document.getElementById('recipe-step');
const moodButtons = document.getElementById('mood-buttons');
const mealTypeButtons = document.getElementById('meal-type-buttons');
const getRecipeBtn = document.getElementById('get-recipe-btn');
const getRecipeBtnActive = document.getElementById('get-recipe-btn-active');
const backBtn = document.getElementById('back-btn');
const newRecipeBtn = document.getElementById('new-recipe-btn');

let currentMood = null;
let currentMealType = null;
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

const mealTypeLabels = {
  breakfast: '🌅 Breakfast',
  'late breakfast': '🥐 Late Breakfast',
  lunch: '🥗 Lunch',
  'midday snack': '🥪 Midday Snack',
  'evening snack': '🌙 Evening Snack',
  dinner: '🍽️ Dinner',
  dessert: '🍰 Dessert',
  any: '✨ Any'
};

function updateGetRecipeButton() {
  const bothSelected = currentMood && currentMealType;
  getRecipeBtn.classList.toggle('hidden', bothSelected);
  getRecipeBtnActive.classList.toggle('hidden', !bothSelected);
  getRecipeBtnActive.disabled = !bothSelected;
}

async function loadOptions() {
  const [moodsRes, mealTypesRes] = await Promise.all([
    fetch('/api/moods'),
    fetch('/api/meal-types')
  ]);
  const moods = await moodsRes.json();
  const mealTypes = await mealTypesRes.json();

  moodButtons.innerHTML = moods.map(mood => `
    <button class="mood-btn px-4 py-2 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 font-medium transition ${currentMood === mood ? 'selected ring-2 ring-amber-500 ring-offset-2' : ''}" data-mood="${mood}">
      ${moodLabels[mood] || mood}
    </button>
  `).join('');

  mealTypeButtons.innerHTML = mealTypes.map(type => `
    <button class="meal-type-btn px-4 py-2 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 font-medium transition ${currentMealType === type ? 'selected ring-2 ring-amber-500 ring-offset-2' : ''}" data-meal-type="${type}">
      ${mealTypeLabels[type] || type}
    </button>
  `).join('');

  const selectedClass = 'selected ring-2 ring-amber-500 ring-offset-2';
  moodButtons.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentMood = btn.dataset.mood;
      document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected', 'ring-2', 'ring-amber-500', 'ring-offset-2'));
      btn.classList.add(...selectedClass.split(' '));
      updateGetRecipeButton();
    });
  });

  mealTypeButtons.querySelectorAll('.meal-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentMealType = btn.dataset.mealType;
      document.querySelectorAll('.meal-type-btn').forEach(b => b.classList.remove('selected', 'ring-2', 'ring-amber-500', 'ring-offset-2'));
      btn.classList.add(...selectedClass.split(' '));
      updateGetRecipeButton();
    });
  });

  updateGetRecipeButton();
}

async function fetchRecipe(mood, mealType, exclude = []) {
  const params = new URLSearchParams();
  if (mealType) params.set('mealType', mealType);
  if (exclude.length) params.set('exclude', exclude.join(','));
  const res = await fetch(`/api/recipes/${mood}${params.toString() ? '?' + params : ''}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

function showRecipe(recipe) {
  const imgEl = document.getElementById('recipe-image');
  imgEl.src = recipe.image || '';
  imgEl.alt = recipe.name;
  imgEl.style.display = recipe.image ? 'block' : 'none';
  document.getElementById('recipe-name').textContent = recipe.name;
  document.getElementById('recipe-desc').textContent = recipe.description || '';
  document.getElementById('recipe-ingredients').textContent = recipe.ingredients;
  document.getElementById('recipe-instructions').textContent = recipe.instructions;

  excludedIds.push(recipe.id);
  selectStep.classList.add('hidden');
  recipeStep.classList.remove('hidden');
}

function getRecipe() {
  if (!currentMood || !currentMealType) return;
  excludedIds = [];
  fetchRecipe(currentMood, currentMealType)
    .then(showRecipe)
    .catch(err => alert('Could not load recipe. Try again.'));
}

function getNewRecipe() {
  fetchRecipe(currentMood, currentMealType, excludedIds)
    .then(showRecipe)
    .catch(() => alert('No more recipes for this combination! Try different mood or meal type.'));
}

function goBack() {
  excludedIds = [];
  recipeStep.classList.add('hidden');
  selectStep.classList.remove('hidden');
}

getRecipeBtnActive.addEventListener('click', getRecipe);
backBtn.addEventListener('click', goBack);
newRecipeBtn.addEventListener('click', getNewRecipe);

loadOptions();
