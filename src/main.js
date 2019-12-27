import PageController from './controllers/page-controller';
import UserProfileComponent from './components/profile-rating';
import FilmsContainer from './components/films-container';
import {generateFilms} from './mock/film';
import {render, RenderPosition} from './utils/render';
import Movies from './models/movies';
import FilterController from './controllers/filter-controller';
import {MenuType} from './components/filters';
import {getProfileRating} from './models/profile';
import StatisticsController from './controllers/statistics-controller';

const FILMS_COUNT = 23;

const moviesModel = new Movies();
moviesModel.setMovies(generateFilms(FILMS_COUNT));
const watchedFilmsQuantity = moviesModel.getMovies()[0].userDetails.personalRating;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, new UserProfileComponent(getProfileRating(watchedFilmsQuantity)), RenderPosition.BEFOREEND);

const filters = new FilterController(siteMainElement, moviesModel);
filters.render();

const filmsComponent = new FilmsContainer();
render(siteMainElement, filmsComponent, RenderPosition.BEFOREEND);

const pageController = new PageController(filmsComponent, moviesModel);

const statisticsController = new StatisticsController(siteMainElement, moviesModel, watchedFilmsQuantity);
statisticsController.render();

statisticsController.hide();
pageController.render();

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
