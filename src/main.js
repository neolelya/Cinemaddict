import {createUserProfileTemplate} from './components/user-profile';
import {createMenuFiltersTemplate} from './components/menu';
import {createFilmCardsContainerTemplate} from './components/films-container';
import {createFilmCardTemplate} from './components/film-card';
import {createShowMoreButtonTemplate} from './components/show-more-button';
import {createFilmCardsExtraContainerTemplate} from './components/extra-films-container';
import {createFilmDetailsTemplate} from './components/film-details';
import {generateFilms, generateFilm} from './mock/film';
import {generateFilters} from './mock/filter';

const FILMS_COUNT = 23;
const WATCHED_FILMS_QUANTITY = 5;
const SHOWING_FILMS_ON_START = 5;
const ADDED_FILMS_BY_BUTTON = 5;

const EXTRAS = [`Top rated`, `Most commented`];

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const generatedFilms = generateFilms(FILMS_COUNT);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, createUserProfileTemplate(WATCHED_FILMS_QUANTITY), `beforeend`);

const filters = generateFilters(generatedFilms);
render(siteMainElement, createMenuFiltersTemplate(filters), `beforeend`);
render(siteMainElement, createFilmCardsContainerTemplate(), `beforeend`);

const filmsListContainer = document.querySelector(`.films-list__container`);

let showingTasksCount = SHOWING_FILMS_ON_START;
generatedFilms
  .slice(0, showingTasksCount)
  .forEach((film) => render(filmsListContainer, createFilmCardTemplate(film), `beforeend`));

render(filmsListContainer, createShowMoreButtonTemplate(), `afterend`);

const topRatedFilms = [...generatedFilms]
  .filter((film) => film.rating > 0)
  .sort((first, second) => second.rating - first.rating)
  .slice(0, 2);

const mostCommentedFilms = [...generatedFilms]
  .filter((film) => film.comments.length > 0)
  .sort((first, second) => second.comments.length - first.comments.length)
  .slice(0, 2);

if (topRatedFilms.length > 0) {
  render(siteMainElement, createFilmCardsExtraContainerTemplate(EXTRAS[0]), `beforeend`);
}

if (mostCommentedFilms.length > 0) {
  render(siteMainElement, createFilmCardsExtraContainerTemplate(EXTRAS[1]), `beforeend`);
}

const filmsListExtraContainer = document.querySelectorAll(`.films-list--extra .films-list__container`);
topRatedFilms.forEach((film) => render(filmsListExtraContainer[0], createFilmCardTemplate(film), `beforeend`));
mostCommentedFilms.forEach((film) => render(filmsListExtraContainer[1], createFilmCardTemplate(film), `beforeend`));


const siteFooterElement = document.querySelector(`.footer`);
render(siteFooterElement, createFilmDetailsTemplate(generateFilm()), `afterend`);

const showMoreButton = document.querySelector(`.films-list__show-more`);
showMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount += ADDED_FILMS_BY_BUTTON;

  generatedFilms.slice(prevTasksCount, showingTasksCount).forEach((film) => render(filmsListContainer, createFilmCardTemplate(film), `beforeend`));

  if (showingTasksCount >= FILMS_COUNT) {
    showMoreButton.remove();
  }
});
