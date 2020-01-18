import API from './api';
import PageController from './controllers/page-controller';
import UserProfileComponent from './components/profile-rating';
import FilmsContainer from './components/films-container';
import {render, RenderPosition} from './utils/render';
import Movies from './models/movies';
import FilterController from './controllers/filter-controller';
import {MenuType} from './components/filters';
import {getProfileRank} from './models/profile';
import StatisticsController from './controllers/statistics-controller';

const AUTHORIZATION = `Basic 8rklKE83521erYEMp`;
const URL = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const api = new API(URL, AUTHORIZATION);
const moviesModel = new Movies();
const loadingElement = `<h2 class="loading">Loading...</h2>`;
let isMoviesModelLoaded = false;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const filters = new FilterController(siteMainElement, moviesModel);
const filmsComponent = new FilmsContainer();
const pageController = new PageController(filmsComponent, moviesModel, api);

if (!isMoviesModelLoaded) {
  render(siteMainElement, filmsComponent, RenderPosition.BEFOREEND);
  filmsComponent.getElement().innerHTML = loadingElement;
}

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);
    isMoviesModelLoaded = true;
    const WATCHED_FILMS_QUANTITY = moviesModel.getMoviesNumber(moviesModel.getMovies());

    const statisticsController = new StatisticsController(siteMainElement, moviesModel, WATCHED_FILMS_QUANTITY);

    render(siteHeaderElement, new UserProfileComponent(getProfileRank(WATCHED_FILMS_QUANTITY)), RenderPosition.BEFOREEND);
    filters.render();
    filmsComponent.getElement().innerHTML = ``;
    render(siteMainElement, filmsComponent, RenderPosition.BEFOREEND);
    statisticsController.render();
    statisticsController.hide();

    filters.setOnChange((menuType) => {
      switch (menuType) {
        case MenuType.FILTER:
          statisticsController.hide();
          filmsComponent.show();
          break;
        case MenuType.STATS:
          statisticsController.show();
          filmsComponent.hide();
          break;
      }
    });

    pageController.render();
  });


