import UserProfileComponent from './components/profile-rating';
import FiltersComponent from './components/filters';
import SortComponent from './components/sort';
import FilmsContainerComponent from './components/films-container';
import FilmsListComponent from './components/films-list';
import FilmComponent from './components/film';
import NoFilmsComponent from './components/no-films';
import ShowMoreButtonComponent from './components/show-more-button';
import ExtraFilmsComponent from './components/extra-films';
import FilmDetailsComponent from './components/film-details';
import {generateFilms} from './mock/film';
import {generateFilters} from './mock/filter';
import {render, RenderPosition} from './utils';

const FILMS_COUNT = 23;
const WATCHED_FILMS_QUANTITY = 5;
const SHOWING_FILMS_ON_START = 5;
const ADDED_FILMS_BY_BUTTON = 5;

const generatedFilms = generateFilms(FILMS_COUNT);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

const renderFilm = (film) => {
  const filmComponent = new FilmComponent(film);
  const filmDetailsComponent = new FilmDetailsComponent(film);
  const filmsListContainer = siteMainElement.querySelector(`.films-list__container`);

  const EscKeyDownHandler = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      closePopup();
    }
  };

  const closePopup = () => {
    document.body.removeChild(filmDetailsComponent.getElement());
    document.removeEventListener(`keydown`, EscKeyDownHandler);
  };

  const filmDetailSelectors = filmComponent.getElement().querySelectorAll(`.film-card__title, .film-card__poster, .film-card__comments`);
  filmDetailSelectors.forEach((element) => {
    element.addEventListener(`click`, () => {
      document.body.appendChild(filmDetailsComponent.getElement());
      document.addEventListener(`keydown`, EscKeyDownHandler);
    });
  });

  const closeButton = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);
  closeButton.addEventListener(`click`, closePopup);

  render(filmsListContainer, filmComponent.getElement(), RenderPosition.BEFOREEND);
};

render(siteHeaderElement, new UserProfileComponent(WATCHED_FILMS_QUANTITY).getElement(), RenderPosition.BEFOREEND);

const filters = generateFilters(generatedFilms);
render(siteMainElement, new FiltersComponent(filters).getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new SortComponent().getElement(), RenderPosition.BEFOREEND);

if (!generatedFilms.length) {
  render(siteMainElement, new NoFilmsComponent().getElement(), RenderPosition.BEFOREEND);
} else {
  const filmsContainer = new FilmsContainerComponent().getElement();
  render(siteMainElement, filmsContainer, RenderPosition.BEFOREEND);

  const filmsList = new FilmsListComponent().getElement();
  render(filmsContainer, filmsList, RenderPosition.BEFOREEND);

  let showingTasksCount = SHOWING_FILMS_ON_START;

  generatedFilms.slice(0, showingTasksCount).forEach((film) => renderFilm(film));

  render(filmsList, new ShowMoreButtonComponent().getElement(), RenderPosition.BEFOREEND);

  const topRatedFilms = [...generatedFilms]
    .filter((film) => film.rating > 0)
    .sort((first, second) => second.rating - first.rating)
    .slice(0, 2);

  const mostCommentedFilms = [...generatedFilms]
    .filter((film) => film.comments.length > 0)
    .sort((first, second) => second.comments.length - first.comments.length)
    .slice(0, 2);

  if (mostCommentedFilms.length > 0) {
    render(filmsList, new ExtraFilmsComponent(`Most commented`).getElement(), RenderPosition.AFTER);
  }

  if (topRatedFilms.length > 0) {
    render(filmsList, new ExtraFilmsComponent(`Top rated`).getElement(), RenderPosition.AFTER);
  }

  const filmsListExtraContainer = document.querySelectorAll(`.films-list--extra .films-list__container`);
  topRatedFilms.forEach((film) => render(filmsListExtraContainer[0], new FilmComponent(film).getElement(), RenderPosition.BEFOREEND));
  mostCommentedFilms.forEach((film) => render(filmsListExtraContainer[1], new FilmComponent(film).getElement(), RenderPosition.BEFOREEND));

  const showMoreButton = document.querySelector(`.films-list__show-more`);
  showMoreButton.addEventListener(`click`, () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount += ADDED_FILMS_BY_BUTTON;

    generatedFilms.slice(prevTasksCount, showingTasksCount).forEach((film) => renderFilm(film));

    if (showingTasksCount >= FILMS_COUNT) {
      showMoreButton.remove();
    }
  });
}
