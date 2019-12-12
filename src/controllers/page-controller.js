import FilmComponent from '../components/film';
import FilmDetailsComponent from '../components/film-details';
import {remove, render, RenderPosition} from '../utils/render';
import NoFilmsComponent from '../components/no-films';
import FilmsContainerComponent from '../components/films-container';
import FilmsListComponent from '../components/films-list';
import ShowMoreButtonComponent from '../components/show-more-button';
import ExtraFilmsComponent from '../components/extra-films';
import SortComponent, {SortType} from '../components/sort';

const SHOWING_FILMS_ON_START = 5;
const ADDED_FILMS_BY_BUTTON = 5;

const renderFilm = (filmsListContainer, film) => {
  const filmComponent = new FilmComponent(film);
  const filmDetailsComponent = new FilmDetailsComponent(film);

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

const renderFilms = (filmsListContainer, films) => {
  films.forEach((film) => renderFilm(filmsListContainer, film));
};

const renderExtraFilms = (filmsList, films) => {
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

    const filmsListContainer = document.querySelector(`.films-list__container`);
    let showingTasksCount = SHOWING_FILMS_ON_START;

    renderFilms(filmsListContainer, films.slice(0, showingTasksCount));

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedFilms = [];

      switch (sortType) {
        case SortType.RATING:
          sortedFilms = films.slice(0, showingTasksCount).sort((a, b) => b.rating - a.rating);
          break;
        case SortType.DATE:
          sortedFilms = films.slice(0, showingTasksCount).sort((a, b) => b.year - a.year);
          break;
        case SortType.DEFAULT:
        default:
          sortedFilms = films.slice(0, showingTasksCount);
          break;
      }

      filmsListContainer.innerHTML = ``;
      renderFilms(filmsListContainer, sortedFilms);
    });

    render(filmsList.getElement(), this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevTasksCount = showingTasksCount;
      showingTasksCount += ADDED_FILMS_BY_BUTTON;

      renderFilms(filmsListContainer, films.slice(prevTasksCount, showingTasksCount));

      if (showingTasksCount >= films.length) {
        remove(this._showMoreButtonComponent);
      }
    });

    renderExtraFilms(filmsList, films);
  }
}
