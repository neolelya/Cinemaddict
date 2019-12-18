import {remove, render, RenderPosition} from '../utils/render';
import NoFilmsComponent from '../components/no-films';
import FilmsContainerComponent from '../components/films-container';
import FilmsListComponent from '../components/films-list';
import ShowMoreButtonComponent from '../components/show-more-button';
import ExtraFilmsComponent from '../components/extra-films';
import SortComponent, {SortType} from '../components/sort';
import MovieController from './movie-controller';

const SHOWING_FILMS_ON_START = 5;
const ADDED_FILMS_BY_BUTTON = 5;
const EXTRA_FILMS_QUANTITY = 2;

export default class PageController {
  constructor(container) {
    this._container = container;

    this._films = [];
    this._displayedFilmControllers = [];
    this._topRatedControllers = [];
    this._mostCommentedControllers = [];

    this._noFilmsComponent = new NoFilmsComponent();
    this._sortComponent = new SortComponent();
    this._filmsContainerComponent = new FilmsContainerComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
  }

  renderFilms(filmsListContainer) {
    filmsListContainer.innerHTML = ``;
    this._displayedFilmControllers = this._displayedFilms.slice(0, this._showingFilmsCount).map((film) => {
      const filmController = new MovieController(filmsListContainer, this._onDataChange, this._onViewChange);
      filmController.render(film);

      return filmController;
    });
  }

  renderExtraFilms(filmsList, films) {
    this._topRatedFilms = [...films]
      .filter((film) => film.rating > 0)
      .sort((first, second) => second.rating - first.rating)
      .slice(0, EXTRA_FILMS_QUANTITY);

    this._mostCommentedFilms = [...films]
      .filter((film) => film.comments.length > 0)
      .sort((first, second) => second.comments.length - first.comments.length)
      .slice(0, EXTRA_FILMS_QUANTITY);

    if (this._mostCommentedFilms.length > 0) {
      render(filmsList.getElement(), new ExtraFilmsComponent(`Most commented`), RenderPosition.AFTER);
    }

    if (this._topRatedFilms.length > 0) {
      render(filmsList.getElement(), new ExtraFilmsComponent(`Top rated movies`), RenderPosition.AFTER);
    }

    const renderExtra = (filmsListContainer, movies) => {
      return movies.map((movie) => {
        const filmController = new MovieController(filmsListContainer, this._onDataChange, this._onViewChange);
        filmController.render(movie);

        return filmController;
      });
    };

    const filmsListExtraContainer = document.querySelectorAll(`.films-list--extra .films-list__container`);
    this._topRatedControllers = renderExtra(filmsListExtraContainer[0], this._topRatedFilms);
    this._mostCommentedControllers = renderExtra(filmsListExtraContainer[1], this._mostCommentedFilms);
  }

  render(films) {
    this._films = films;

    this._showingFilmsCount = SHOWING_FILMS_ON_START;
    this._displayedFilms = films;

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

    const filmsListContainer = filmsList.getElement().querySelector(`.films-list__container`);

    this.renderFilms(filmsListContainer);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      switch (sortType) {
        case SortType.RATING:
          this._displayedFilms = films.sort((a, b) => b.rating - a.rating);
          break;
        case SortType.DATE:
          this._displayedFilms = films.sort((a, b) => b.year - a.year);
          break;
        case SortType.DEFAULT:
        default:
          this._displayedFilms = films;
          break;
      }

      this.renderFilms(filmsListContainer);
    });

    render(filmsList.getElement(), this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(() => {
      this._showingFilmsCount += ADDED_FILMS_BY_BUTTON;
      this.renderFilms(filmsListContainer);

      if (this._showingFilmsCount >= films.length) {
        remove(this._showMoreButtonComponent);
      }
    });

    this.renderExtraFilms(filmsList, films);
  }

  _updateFilmAndRerender(oldFilm, newFilm, films, controllers) {
    const index = films.findIndex((it) => it === oldFilm);

    if (index >= 0) {
      if (controllers && controllers[index]) {
        controllers[index].render(newFilm);
      }
      return [].concat(films.slice(0, index), newFilm, films.slice(index + 1));
    }
    return films;
  }

  _onDataChange(oldFilm, newFilm) {
    this._films = this._updateFilmAndRerender(oldFilm, newFilm, this._films);
    this._displayedFilms = this._updateFilmAndRerender(oldFilm, newFilm, this._displayedFilms, this._displayedFilmControllers);
    this._topRatedFilms = this._updateFilmAndRerender(oldFilm, newFilm, this._topRatedFilms, this._topRatedControllers);
    this._mostCommentedFilms = this._updateFilmAndRerender(oldFilm, newFilm, this._mostCommentedFilms, this._mostCommentedControllers);
  }

  _onViewChange() {
    this._displayedFilmControllers.forEach((it) => it.setDefaultView());
    this._topRatedControllers.forEach((it) => it.setDefaultView());
    this._mostCommentedControllers.forEach((it) => it.setDefaultView());
  }
}
