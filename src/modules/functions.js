import bootstrap from 'bootstrap/dist/js/bootstrap.js';
import {
  selectCategories, result, homeSection, favoritesSection, favoritesDiv
} from './variables.js';

window.bootstrap = bootstrap;

const modal = new bootstrap.Modal('#modal', {});

export const cleanHTML = (selector) => {
  while (selector.firstChild) {
    selector.removeChild(selector.firstChild);
  }
};

export const addFavorite = (recipe) => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
  localStorage.setItem('favorites', JSON.stringify([...favorites, recipe]));
};

export const existStorage = (id) => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
  return favorites.some((favorite) => favorite.id === id);
};

export const deleteFavorite = (id) => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];
  const newFavorites = favorites.filter((favorite) => favorite.id !== id);
  localStorage.setItem('favorites', JSON.stringify(newFavorites));
};

export const showToast = (message) => {
  const toastDiv = document.querySelector('#toast');
  const toastBody = document.querySelector('.toast-body');
  const toast = new bootstrap.Toast(toastDiv);
  toastBody.textContent = message;
  toast.show();
};

export const showCategories = (categories) => {
  categories.forEach((category) => {
    const option = document.createElement('OPTION');
    option.value = category.strCategory;
    option.textContent = category.strCategory;
    selectCategories.appendChild(option);
  });
};

export const getCategories = () => {
  const url = 'https://www.themealdb.com/api/json/v1/1/categories.php';

  fetch(url)
    .then((response) => response.json())
    .then((data) => showCategories(data.categories))
    .catch((error) => error);
};

export const showRecipeModal = (recipe) => {
  const {
    strMeal, strInstructions, strMealThumb, idMeal,
  } = recipe;

  const modalTitle = document.querySelector('.modal .modal-title');
  const modalBody = document.querySelector('.modal .modal-body');
  const modalFooter = document.querySelector('.modal-footer');

  cleanHTML(modalBody);
  cleanHTML(modalFooter);

  modalTitle.textContent = strMeal;

  const modalImg = document.createElement('IMG');
  modalImg.classList.add('img-fluid');
  modalImg.alt = `Recipe ${strMeal}`;
  modalImg.src = strMealThumb;
  modalBody.appendChild(modalImg);

  const modalInstructions = document.createElement('H3');
  modalInstructions.classList.add('my-3');
  modalInstructions.textContent = 'Instructions';
  modalBody.appendChild(modalInstructions);

  const modalInstructionsTxt = document.createElement('P');
  modalInstructionsTxt.textContent = strInstructions;
  modalBody.appendChild(modalInstructionsTxt);

  const IngredientMeasure = document.createElement('H3');
  IngredientMeasure.classList.add('my-3');
  IngredientMeasure.textContent = 'Ingredients and amounts';
  modalBody.appendChild(IngredientMeasure);

  const listGroup = document.createElement('UL');
  listGroup.classList.add('list-group');
  modalBody.appendChild(listGroup);

  for (let i = 1; i <= 20; i += 1) {
    if (recipe[`strIngredient${i}`]) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];

      const ingredientLi = document.createElement('LI');
      ingredientLi.classList.add('list-group-item');
      ingredientLi.innerHTML = `${ingredient} - ${measure}`;

      listGroup.appendChild(ingredientLi);
    }
  }

  const btnFavorite = document.createElement('BUTTON');
  btnFavorite.setAttribute('type', 'button');
  btnFavorite.classList.add('btn', 'btn-danger', 'col');
  btnFavorite.textContent = existStorage(idMeal) ? 'Delete favorite' : 'Add to favorite';

  btnFavorite.onclick = () => {
    if (existStorage(idMeal)) {
      deleteFavorite(idMeal);
      btnFavorite.textContent = 'Add to favorite';
      showToast('Deleted Successfully');
      return;
    }

    addFavorite({
      id: idMeal,
      title: strMeal,
      img: strMealThumb,
    });
    btnFavorite.textContent = 'Delete favorite';
    showToast('Added Successfully');
  };

  modalFooter.appendChild(btnFavorite);

  const btnCloseModal = document.createElement('BUTTON');
  btnCloseModal.setAttribute('type', 'button');
  btnCloseModal.classList.add('btn', 'btn-secondary', 'col');
  btnCloseModal.textContent = 'Close';
  btnCloseModal.onclick = () => {
    modal.hide();
  };
  modalFooter.appendChild(btnCloseModal);

  // show modal
  modal.show();
};

export const getRecipeModal = (id) => {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => showRecipeModal(data.meals[0]))
    .catch((error) => error);
};

export const showRecipesByCategory = (recipes) => {
  cleanHTML(result);

  recipes.forEach((recipe) => {
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
    seeRecipeBtn.onclick = () => {
      getRecipeModal(idMeal);
    };

    recipeCardBody.appendChild(recipeHeading);
    recipeCardBody.appendChild(seeRecipeBtn);

    recipeCard.appendChild(recipeImg);
    recipeCard.appendChild(recipeCardBody);

    recipeContainer.appendChild(recipeCard);

    result.appendChild(recipeContainer);
  });
};

export const selectCategory = (e) => {
  const category = e.target.value;

  const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => showRecipesByCategory(data.meals))
    .catch((error) => error);
};

export const getFavorites = () => {
  const favorites = JSON.parse(localStorage.getItem('favorites')) ?? [];

  if (favorites.length) {
    cleanHTML(result);

    favorites.forEach((recipe) => {
    const { id, title, img } = recipe;

    const recipeContainer = document.createElement('DIV');
    recipeContainer.classList.add('col-md-4');

    const recipeCard = document.createElement('DIV');
    recipeCard.classList.add('card', 'mb-4');

    const recipeImg = document.createElement('IMG');
    recipeImg.classList.add('card-img-top');
    recipeImg.alt = `Recipe Image ${img}`;
    recipeImg.src = img;

    const recipeCardBody = document.createElement('DIV');
    recipeCardBody.classList.add('card-body');

    const recipeHeading = document.createElement('H3');
    recipeHeading.classList.add('card-title', 'mb-3');
    recipeHeading.textContent = title;

    const seeRecipeBtn = document.createElement('BUTTON');
    seeRecipeBtn.classList.add('btn', 'btn-danger', 'w-100');
    seeRecipeBtn.textContent = 'See recipe';
    seeRecipeBtn.onclick = () => {
      getRecipeModal(id);
    };

    recipeCardBody.appendChild(recipeHeading);
    recipeCardBody.appendChild(seeRecipeBtn);

    recipeCard.appendChild(recipeImg);
    recipeCard.appendChild(recipeCardBody);

    recipeContainer.appendChild(recipeCard);

    favoritesDiv.appendChild(recipeContainer);
  });
    return
  }

  const noFavorites = document.createElement('P');
  noFavorites.classList.add('fs-4', 'text-center', 'font-bold', 'mt-5');
  noFavorites.textContent = 'No favorites yet';
  favoritesDiv.appendChild(noFavorites);
}