const recipeList = document.getElementById("recipe-list");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById('search-input');
const recipeModal = document.getElementById("recipe-modal");
const modalContent = document.querySelector(".modal-content");
const modalCloseBtn = document.querySelector(".close");
const modalTitle = document.getElementById("modal-title");
const modalImage = document.getElementById("modal-image");
const modalSummary = document.getElementById("modal-summary");

// untuk mengambil resep dari API
async function fetchRecipes() {
  // URL API
  const apiUrl =
    'https://api.spoonacular.com/recipes/complexSearch?apiKey=680413bf12d94101b26e9d8aae092705&includeNutrition=true';

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Memanipulasi data dan menampilkannya dalam HTML
    data.results.forEach(async recipe => {
      const recipeDetails = await fetchRecipeDetails(recipe.id);
      const recipeCard = createRecipeCard(recipe, recipeDetails);
      recipeList.appendChild(recipeCard);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Membuat elemen kartu resep
function createRecipeCard(recipe, recipeDetails) {
  const recipeCard = document.createElement('div');
  recipeCard.classList.add('recipe-card');

  const recipeImage = document.createElement('img');
  recipeImage.src = recipe.image;
  recipeImage.alt = recipe.title;
  recipeCard.appendChild(recipeImage);

  const recipeTitle = document.createElement('h2');
  recipeTitle.textContent = recipe.title;
  recipeCard.appendChild(recipeTitle);

  recipeCard.addEventListener('click', () => {
    openModal(recipe, recipeDetails);
  });

  return recipeCard;
}

// Mengambil detail resep berdasarkan ID resep
async function fetchRecipeDetails(recipeId) {
  const recipeDetailsUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=680413bf12d94101b26e9d8aae092705`;

  try {
    const response = await fetch(recipeDetailsUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Mencari resep berdasarkan masukan pengguna
async function searchRecipes(event) {
  event.preventDefault();
  const searchQuery = searchInput.value;

  // URL API pencarian
  const searchApiUrl = `https://api.spoonacular.com/recipes/complexSearch?apiKey=680413bf12d94101b26e9d8aae092705&query=${searchQuery}&includeNutrition=true`;

  try {
    const response = await fetch(searchApiUrl);
    const data = await response.json();

    // Menghapus resep yang ada sebelumnya
    recipeList.innerHTML = '';

    // Memanipulasi data dan menampilkannya dalam HTML
    data.results.forEach(async recipe => {
      const recipeDetails = await fetchRecipeDetails(recipe.id);
      const recipeCard = createRecipeCard(recipe, recipeDetails);
      recipeList.appendChild(recipeCard);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Membuka modal dan menampilkan detail resep
function openModal(recipe, recipeDetails) {
  modalTitle.textContent = recipe.title;
  modalImage.src = recipe.image;
  modalImage.alt = recipe.title;
  modalSummary.innerHTML = removeHtmlTags(recipeDetails.summary);
  recipeModal.style.display = 'block';
}

// Menghapus tag HTML dari teks
function removeHtmlTags(text) {
  const temp = document.createElement('div');
  temp.innerHTML = text;
  return temp.textContent || temp.innerText;
}

// Menutup modal
function closeModal() {
  recipeModal.style.display = 'none';
}

// Event listener untuk saat form pencarian di-submit
searchForm.addEventListener('submit', searchRecipes);

// Event listener untuk menutup modal saat tombol close diklik
modalCloseBtn.addEventListener('click', closeModal);

// Mengambil resep pertama kali saat halaman dimuat
fetchRecipes();
