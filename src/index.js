import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import {
  getCategories, selectCategory, getFavorites,
} from './modules/functions.js';
import {
  selectCategories, favoritesLink, homeLink, favoritesSection, homeSection,
} from './modules/variables.js';

document.addEventListener('DOMContentLoaded', () => {
  getCategories();
  getFavorites();
});

selectCategories.addEventListener('change', selectCategory);

favoritesLink.addEventListener('click', () => {
  favoritesSection.classList.remove('d-none');
  homeSection.classList.add('d-none');
});

homeLink.addEventListener('click', () => {
  favoritesSection.classList.add('d-none');
  homeSection.classList.remove('d-none');
});
