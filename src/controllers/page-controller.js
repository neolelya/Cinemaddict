import FilmComponent from '../components/film';
import FilmDetailsComponent from '../components/film-details';
import {remove, render, RenderPosition} from '../utils/render';
import NoFilmsComponent from '../components/no-films';
import FilmsContainerComponent from '../components/films-container';
import FilmsListComponent from '../components/films-list';
import ShowMoreButtonComponent from '../components/show-more-button';
import ExtraFilmsComponent from '../components/extra-films';
import SortComponent from '../components/sort';

const SHOWING_FILMS_ON_START = 5;
const ADDED_FILMS_BY_BUTTON = 5;

export const renderFilm = (film) => {
  const filmComponent = new FilmComponent(film);
  const filmDetailsComponent = new FilmDetailsComponent(film);
  const filmsListContainer = document.querySelector(`.films-list__container`);

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

  filmComponent.setDetailClickHandler(() => {
    document.body.appendChild(filmDetailsComponent.getElement());
    document.addEventListener(`keydown`, EscKeyDownHandler);
  });

  const closeButton = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);
  closeButton.addEventListener(`click`, closePopup);

  render(filmsListContainer, filmComponent, RenderPosition.BEFOREEND);
};

export default class PageController {
  constructor(container) {
    this._container = container;

    this._noFilmsComponent = new NoFilmsComponent();
    this._sortComponent = new SortComponent();
    this._filmsContainerComponent = new FilmsContainerComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
  }

  render(films) {
    const container = this._container.getElement();

    if (!films.length) {
      render(container, this._noFilmsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);

    const filmsContainer = this._filmsContainerComponent;
    render(container, filmsContainer, RenderPosition.BEFOREEND);

    const filmsList = this._filmsListComponent;
    render(filmsContainer.getElement(), filmsList, RenderPosition.BEFOREEND);

    let showingTasksCount = SHOWING_FILMS_ON_START;

    films.slice(0, showingTasksCount).forEach((film) => renderFilm(film));

    const showMoreButton = this._showMoreButtonComponent;
    render(filmsList.getElement(), showMoreButton, RenderPosition.BEFOREEND);

    const topRatedFilms = [...films]
      .filter((film) => film.rating > 0)
      .sort((first, second) => second.rating - first.rating)
      .slice(0, 2);

    const mostCommentedFilms = [...films]
      .filter((film) => film.comments.length > 0)
      .sort((first, second) => second.comments.length - first.comments.length)
      .slice(0, 2);

    if (mostCommentedFilms.length > 0) {
      render(filmsList.getElement(), new ExtraFilmsComponent(`Most commented`), RenderPosition.AFTER);
    }

    if (topRatedFilms.length > 0) {
      render(filmsList.getElement(), new ExtraFilmsComponent(`Most commented`), RenderPosition.AFTER);
    }

    const filmsListExtraContainer = document.querySelectorAll(`.films-list--extra .films-list__container`);
    topRatedFilms.forEach((film) => render(filmsListExtraContainer[0], new FilmComponent(film), RenderPosition.BEFOREEND));
    mostCommentedFilms.forEach((film) => render(filmsListExtraContainer[1], new FilmComponent(film), RenderPosition.BEFOREEND));

    showMoreButton.setClickHandler(() => {
      const prevTasksCount = showingTasksCount;
      showingTasksCount += ADDED_FILMS_BY_BUTTON;

      films.slice(prevTasksCount, showingTasksCount).forEach((film) => renderFilm(film));

      if (showingTasksCount >= films.length) {
        remove(showMoreButton);
      }
    });
  }
}
