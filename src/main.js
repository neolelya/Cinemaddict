import UserProfileComponent from './components/user-profile';
import MenuFiltersComponent from './components/menu';
import FilmsContainerComponent from './components/films-container';
import FilmCardComponent from './components/film-card';
import ShowMoreButtonComponent from './components/show-more-button';
import FilmsExtraContainerComponent from './components/extra-films-container';
import FilmDetailsComponent from './components/film-details';
import {generateFilms} from './mock/film';
import {generateFilters} from './mock/filter';
import {render, RenderPosition} from './utils';

const FILMS_COUNT = 23;
const WATCHED_FILMS_QUANTITY = 5;
const SHOWING_FILMS_ON_START = 5;
const ADDED_FILMS_BY_BUTTON = 5;

const EXTRAS = [`Top rated`, `Most commented`];

const generatedFilms = generateFilms(FILMS_COUNT);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, new UserProfileComponent(WATCHED_FILMS_QUANTITY).getElement(), RenderPosition.BEFOREEND);

const filters = generateFilters(generatedFilms);
render(siteMainElement, new MenuFiltersComponent(filters).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilmsContainerComponent().getElement(), RenderPosition.BEFOREEND);

const filmsListContainer = document.querySelector(`.films-list__container`);
const filmsList = document.querySelector(`.films`);

let showingTasksCount = SHOWING_FILMS_ON_START;

const renderFilm = (film) => {
  const filmComponent = new FilmCardComponent(film);
  const filmDetailsComponent = new FilmDetailsComponent(film);

  const filmDetailSelectors = filmComponent.getElement().querySelectorAll(`.film-card__title, .film-card__poster, .film-card__comments`);
  filmDetailSelectors.forEach((element) => {
    element.addEventListener(`click`, () => {
      filmsListContainer.appendChild(filmDetailsComponent.getElement());
    });
  });

  const closeButton = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);
  closeButton.addEventListener(`click`, () => {
    filmsListContainer.removeChild(filmDetailsComponent.getElement());
  });

  render(filmsListContainer, filmComponent.getElement(), RenderPosition.BEFOREEND);
};

generatedFilms.slice(0, showingTasksCount).forEach((film) => renderFilm(film));

render(filmsListContainer, new ShowMoreButtonComponent().getElement(), RenderPosition.AFTER);

const topRatedFilms = [...generatedFilms]
  .filter((film) => film.rating > 0)
  .sort((first, second) => second.rating - first.rating)
  .slice(0, 2);

const mostCommentedFilms = [...generatedFilms]
  .filter((film) => film.comments.length > 0)
  .sort((first, second) => second.comments.length - first.comments.length)
  .slice(0, 2);

if (topRatedFilms.length > 0) {
  render(filmsList, new FilmsExtraContainerComponent(EXTRAS[0]).getElement(), RenderPosition.BEFOREEND);
}

if (mostCommentedFilms.length > 0) {
  render(filmsList, new FilmsExtraContainerComponent(EXTRAS[1]).getElement(), RenderPosition.BEFOREEND);
}

const filmsListExtraContainer = document.querySelectorAll(`.films-list--extra .films-list__container`);
topRatedFilms.forEach((film) => render(filmsListExtraContainer[0], new FilmCardComponent(film).getElement(), RenderPosition.BEFOREEND));
mostCommentedFilms.forEach((film) => render(filmsListExtraContainer[1], new FilmCardComponent(film).getElement(), RenderPosition.BEFOREEND));

const showMoreButton = document.querySelector(`.films-list__show-more`);
showMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount += ADDED_FILMS_BY_BUTTON;

  generatedFilms.slice(prevTasksCount, showingTasksCount).forEach((film) => renderFilm(film));

  if (showingTasksCount >= FILMS_COUNT) {
    showMoreButton.remove();
  }
});
