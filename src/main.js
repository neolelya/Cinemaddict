import PageController from './controllers/page-controller';
import UserProfileComponent from './components/profile-rating';
import FilmsContainer from './components/films-container';
import {generateFilms} from './mock/film';
import {render, RenderPosition} from './utils/render';
import Movies from './models/movies';
import FilterController from './controllers/filter-controller';

const FILMS_COUNT = 23;
const WATCHED_FILMS_QUANTITY = 5;

const moviesModel = new Movies();
moviesModel.setMovies(generateFilms(FILMS_COUNT));

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, new UserProfileComponent(WATCHED_FILMS_QUANTITY), RenderPosition.BEFOREEND);

const filters = new FilterController(siteMainElement, moviesModel);
filters.render();

const filmsComponent = new FilmsContainer();
render(siteMainElement, filmsComponent, RenderPosition.BEFOREEND);

const pageController = new PageController(filmsComponent, moviesModel);

pageController.render();
