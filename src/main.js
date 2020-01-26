import API from './api';
import PageController from './controllers/page-controller';
import FilmsContainer from './components/films-container';
import {render, RenderPosition} from './utils/render';
import Movies from './models/movies';
import FilterController from './controllers/filter-controller';
import {MenuType} from './components/filters';
import StatisticsController from './controllers/statistics-controller';
import UserProfileController from './controllers/user-profile-controller';

const AUTHORIZATION = `Basic 8rklKE83521erYEMp`;
const URL = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

const api = new API(URL, AUTHORIZATION);
const moviesModel = new Movies();

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);
const filtersController = new FilterController(siteMainElement, moviesModel);
const filmsComponent = new FilmsContainer();
const pageController = new PageController(filmsComponent, moviesModel, api);

filtersController.render();
render(siteMainElement, filmsComponent, RenderPosition.BEFOREEND);
pageController.setLoadingState(true);
pageController.render();

api.getMovies()
  .then((movies) => {
    moviesModel.setMovies(movies);

    const statisticsController = new StatisticsController(siteMainElement, moviesModel);
    const userProfileController = new UserProfileController(siteHeaderElement, moviesModel);

    userProfileController.render();
    filtersController.render();
    statisticsController.render();
    statisticsController.hide();

    filtersController.setChangeMenuHandler((menuType) => {
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

    pageController.setLoadingState(false);
    pageController.render();
  });


