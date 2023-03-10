import { selectCategories } from './variables.js';

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
    .then( response => response.json())
    .then(data => showCategories(data.categories))
    .catch(error => error);
}