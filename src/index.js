import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';
import { getCategories, selectCategory } from './modules/functions.js';
import { selectCategories } from './modules/variables.js';

document.addEventListener('DOMContentLoaded', getCategories);

selectCategories.addEventListener('change', selectCategory)