import { selectCategories, result } from './variables.js';

export const cleanHTML = (selector) => {
  while (selector.firstChild) {
    selector.removeChild(selector.firstChild);
  }
}

export const showCategories = (categories) => {
  categories.forEach(category => {
    const option = document.createElement('OPTION');
    option.value = category.strCategory;
    option.textContent = category.strCategory;
    selectCategories.appendChild(option);
  });
}

export const getCategories = () => {
  const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';

  fetch(url)
    .then(response => response.json())
    .then(data => showCategories(data.categories))
    .catch(error => error);
}

export const showRecipeModal = (recipe) => {
  console.log(recipe);
}

export const getRecipeId = (id) => {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`

  fetch(url)
    .then(response => response.json())
    .then(data => showRecipeModal(data.meals[0]))
    .catch(error => error);
}

export const showRecipes = (recipes) => {

  cleanHTML(result);

  recipes.forEach(recipe => {
    const { strMeal, strMealThumb, idMeal } = recipe;

    const recipeContainer = document.createElement('DIV');
    recipeContainer.classList.add('col-md-4');

    const recipeCard = document.createElement('DIV');
    recipeCard.classList.add('card', 'mb-4');

    const recipeImg = document.createElement('IMG');
    recipeImg.classList.add('card-img-top');
    recipeImg.alt = `Recipe Image ${strMeal}`;
    recipeImg.src = strMealThumb;

    const recipeCardBody = document.createElement('DIV');
    recipeCardBody.classList.add('card-body');

    const recipeHeading = document.createElement('H3');
    recipeHeading.classList.add('card-title', 'mb-3');
    recipeHeading.textContent = strMeal;

    const seeRecipeBtn = document.createElement('BUTTON');
    seeRecipeBtn.classList.add('btn', 'btn-danger', 'w-100');
    seeRecipeBtn.textContent = 'See recipe';
    // seeRecipeBtn.dataset.bsTarget = "#modal";
    // seeRecipeBtn.dataset.bsToggle = "modal";
    seeRecipeBtn.onclick = function() {
      getRecipeId(idMeal)
    }

    recipeCardBody.appendChild(recipeHeading);
    recipeCardBody.appendChild(seeRecipeBtn);

    recipeCard.appendChild(recipeImg);
    recipeCard.appendChild(recipeCardBody);

    recipeContainer.appendChild(recipeCard);

    result.appendChild(recipeContainer)
  });
}

export const selectCategory = (e) => {
  const category = e.target.value;

  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;

  fetch(url)
    .then(response => response.json())
    .then(data => showRecipes(data.meals))
    .catch(error => error);
}