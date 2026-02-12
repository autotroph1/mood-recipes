const selectStep = document.getElementById('select-step');
const recipeStep = document.getElementById('recipe-step');
const moodButtons = document.getElementById('mood-buttons');
const mealTypeButtons = document.getElementById('meal-type-buttons');
const getRecipeBtn = document.getElementById('get-recipe-btn');
const getRecipeBtnActive = document.getElementById('get-recipe-btn-active');
const backBtn = document.getElementById('back-btn');
const newRecipeBtn = document.getElementById('new-recipe-btn');
const backFromRecipeBtn = document.getElementById('back-from-recipe-btn');
const tabIngredients = document.getElementById('tab-ingredients');
const tabInstructions = document.getElementById('tab-instructions');
const tabIngredientsContent = document.getElementById('tab-ingredients-content');
const tabInstructionsContent = document.getElementById('tab-instructions-content');

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

function getButtonClasses(selected, base = 'btn-mood') {
  const baseClasses = 'px-4 py-2.5 rounded-xl font-medium text-sm transition';
  const unselected = 'bg-[#F0F0F0] text-[#1D1F25] hover:bg-[#E5E5E5]';
  const selectedClasses = 'bg-[#F3EFFF] text-[#7D55FA] font-semibold border border-[#7D55FA]';
  return `${base} ${baseClasses} ${selected ? selectedClasses : unselected}`;
}

async function loadOptions() {
  const [moodsRes, mealTypesRes] = await Promise.all([
    fetch('/api/moods'),
    fetch('/api/meal-types')
  ]);
  const moods = await moodsRes.json();
  const mealTypes = await mealTypesRes.json();

  moodButtons.innerHTML = moods.map(mood => `
    <button class="mood-btn ${getButtonClasses(currentMood === mood)}" data-mood="${mood}">
      ${moodLabels[mood] || mood}
    </button>
  `).join('');

  mealTypeButtons.innerHTML = mealTypes.map(type => `
    <button class="meal-type-btn ${getButtonClasses(currentMealType === type)}" data-meal-type="${type}">
      ${mealTypeLabels[type] || type}
    </button>
  `).join('');

  moodButtons.querySelectorAll('.mood-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentMood = btn.dataset.mood;
      moodButtons.querySelectorAll('.mood-btn').forEach(b => {
        b.className = getButtonClasses(b.dataset.mood === currentMood, 'mood-btn');
      });
      updateGetRecipeButton();
    });
  });

  mealTypeButtons.querySelectorAll('.meal-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentMealType = btn.dataset.mealType;
      mealTypeButtons.querySelectorAll('.meal-type-btn').forEach(b => {
        b.className = getButtonClasses(b.dataset.mealType === currentMealType, 'meal-type-btn');
      });
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
  const creditEl = document.getElementById('recipe-image-credit');
  imgEl.src = recipe.image || '';
  imgEl.alt = recipe.name;
  imgEl.style.display = recipe.image ? 'block' : 'none';
  creditEl.textContent = recipe.imageCredit || '';
  creditEl.style.display = recipe.imageCredit ? 'block' : 'none';
  document.getElementById('recipe-name').textContent = recipe.name;
  document.getElementById('recipe-desc').textContent = recipe.description || '';
  document.getElementById('recipe-ingredients').textContent = recipe.ingredients;
  document.getElementById('recipe-instructions').textContent = recipe.instructions;

  excludedIds.push(recipe.id);
  selectStep.classList.add('hidden');
  recipeStep.classList.remove('hidden');

  // Reset to Ingredients tab
  tabIngredients.className = 'tab-btn px-4 py-2 rounded-lg text-sm font-medium bg-[#7D55FA] text-white';
  tabInstructions.className = 'tab-btn px-4 py-2 rounded-lg text-sm font-medium bg-[#F0F0F0] text-[#1D1F25]';
  tabIngredientsContent.classList.remove('hidden');
  tabInstructionsContent.classList.add('hidden');
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

// Tab switching
tabIngredients.addEventListener('click', () => {
  tabIngredients.className = 'tab-btn px-4 py-2 rounded-lg text-sm font-medium bg-[#7D55FA] text-white';
  tabInstructions.className = 'tab-btn px-4 py-2 rounded-lg text-sm font-medium bg-[#F0F0F0] text-[#1D1F25]';
  tabIngredientsContent.classList.remove('hidden');
  tabInstructionsContent.classList.add('hidden');
});

tabInstructions.addEventListener('click', () => {
  tabInstructions.className = 'tab-btn px-4 py-2 rounded-lg text-sm font-medium bg-[#7D55FA] text-white';
  tabIngredients.className = 'tab-btn px-4 py-2 rounded-lg text-sm font-medium bg-[#F0F0F0] text-[#1D1F25]';
  tabInstructionsContent.classList.remove('hidden');
  tabIngredientsContent.classList.add('hidden');
});

getRecipeBtnActive.addEventListener('click', getRecipe);
backBtn.addEventListener('click', goBack);
newRecipeBtn.addEventListener('click', getNewRecipe);
backFromRecipeBtn.addEventListener('click', goBack);

loadOptions();
