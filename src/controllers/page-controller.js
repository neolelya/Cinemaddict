import {remove, render, RenderPosition} from '../utils/render';
import NoFilmsComponent from '../components/no-films';
import FilmsContainerComponent from '../components/films-container';
import FilmsListComponent from '../components/films-list';
import ShowMoreButtonComponent from '../components/show-more-button';
import ExtraFilmsComponent from '../components/extra-films';
import SortComponent from '../components/sort';
import MovieController from './movie-controller';

const SHOWING_FILMS_ON_START = 5;
const ADDED_FILMS_BY_BUTTON = 5;

export default class PageController {
  constructor(container, filmsModel, api) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._api = api;

    this._filmsListContainer = null;
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
    this._onFilterChange = this._onFilterChange.bind(this);

    this._filmsModel.onFilterChange(this._onFilterChange);
  }

  renderFilms() {
    this._filmsListContainer.innerHTML = ``;
    this._displayedFilmControllers = this._displayedFilms.slice(0, this._showingFilmsCount).map((film) => {
      const filmController = new MovieController(this._filmsListContainer, this._onDataChange, this._onViewChange, this._api);
      filmController.render(film);

      return filmController;
    });
  }

  renderExtraFilms(filmsList) {
    this._mostCommentedFilms = this._filmsModel.getMostCommentedMovies();
    this._topRatedFilms = this._filmsModel.getTopRatedMovies();

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

  render() {
    const container = this._container.getElement();
    const films = this._filmsModel.getMovies();

    this._showingFilmsCount = SHOWING_FILMS_ON_START;
    this._displayedFilms = films;

    if (!films.length) {
      render(container, this._noFilmsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);

    const filmsContainer = this._filmsContainerComponent;
    render(container, filmsContainer, RenderPosition.BEFOREEND);

    const filmsList = this._filmsListComponent;
    render(filmsContainer.getElement(), filmsList, RenderPosition.BEFOREEND);

    this._filmsListContainer = filmsList.getElement().querySelector(`.films-list__container`);

    this.renderFilms();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      this._filmsModel.setSorting(sortType);
      this._displayedFilms = this._filmsModel.getMovies();
      this.renderFilms();
    });

    render(filmsList.getElement(), this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(() => {
      this._showingFilmsCount += ADDED_FILMS_BY_BUTTON;
      this.renderFilms();

      if (this._showingFilmsCount >= this._displayedFilms.length) {
        remove(this._showMoreButtonComponent);
      }
    });

    this.renderExtraFilms(filmsList);
  }

  _updateFilmAndRerender(oldFilm, newFilm, films, controllers) {
    const index = films.findIndex((it) => it === oldFilm);

    if (index >= 0) {
      if (controllers && controllers[index]) {
        controllers[index].render(newFilm);
      }
      this._filmsModel.updateMovie(newFilm.id, newFilm);
    }
  }

  _onDataChange(oldFilm, newFilm) {
    this._api.updateMovie(oldFilm.id, newFilm)
      .then((film) => {
        this._updateFilmAndRerender(oldFilm, film, this._displayedFilms, this._displayedFilmControllers);
        this._displayedFilms = this._filmsModel.getMovies();

        this._updateFilmAndRerender(oldFilm, film, this._topRatedFilms, this._topRatedControllers);
        this._topRatedFilms = this._filmsModel.getTopRatedMovies();

        this._updateFilmAndRerender(oldFilm, film, this._mostCommentedFilms, this._mostCommentedControllers);
        this._mostCommentedFilms = this._filmsModel.getMostCommentedMovies();
      });
  }

  _onViewChange() {
    this._displayedFilmControllers.forEach((it) => it.setDefaultView());
    this._topRatedControllers.forEach((it) => it.setDefaultView());
    this._mostCommentedControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._displayedFilms = this._filmsModel.getMovies();
    this.renderFilms();
  }

  show() {
    this._container.show();
  }

  hide() {
    this._container.hide();
  }
}
