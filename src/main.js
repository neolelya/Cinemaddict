import PageController from './controllers/page-controller';
import UserProfileComponent from './components/profile-rating';
import FiltersComponent from './components/filters';
import FilmsContainer from './components/films-container';
import {generateFilms} from './mock/film';
import {generateFilters} from './mock/filter';
import {render, RenderPosition} from './utils/render';

const FILMS_COUNT = 23;
const WATCHED_FILMS_QUANTITY = 5;

const generatedFilms = generateFilms(FILMS_COUNT);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, new UserProfileComponent(WATCHED_FILMS_QUANTITY), RenderPosition.BEFOREEND);

const filters = generateFilters(generatedFilms);
render(siteMainElement, new FiltersComponent(filters), RenderPosition.BEFOREEND);

const filmsComponent = new FilmsContainer();
render(siteMainElement, filmsComponent, RenderPosition.BEFOREEND);

const pageController = new PageController(filmsComponent);

pageController.render(generatedFilms);
