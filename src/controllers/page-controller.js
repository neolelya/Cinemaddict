import {remove, render, RenderPosition} from '../utils/render';
import NoFilmsComponent from '../components/no-films';
import FilmsContainerComponent from '../components/films-container';
import FilmsListComponent from '../components/films-list';
import ShowMoreButtonComponent from '../components/show-more-button';
import ExtraFilmsComponent from '../components/extra-films';
import SortComponent from '../components/sort';
import MovieController from './movie-controller';
import MovieDetailsController from './movie-details-controller';

const SHOWING_FILMS_ON_START = 5;
const ADDED_FILMS_BY_BUTTON = 5;

export default class PageController {
  constructor(container, filmsModel, api) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._api = api;

    this._sortComponent = new SortComponent();
    this._filmsContainerComponent = new FilmsContainerComponent();
    this._filmsListComponent = new FilmsListComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();

    this._dataChangeHandler = this._dataChangeHandler.bind(this);
    this._viewChangeHandler = this._viewChangeHandler.bind(this);
    this._filterChangeHandler = this._filterChangeHandler.bind(this);

    this._filmsListContainer = null;
    this._filmsListExtraContainer = null;
    this._movieDetailsController = new MovieDetailsController(this._dataChangeHandler, this._api);
    this._isLoading = false;

    this._filmsModel.filterChangeHandler(this._filterChangeHandler);
  }

  renderFilms() {
    if (!this._filmsListContainer) {
      return;
    }
    this._filmsListContainer.innerHTML = ``;
    this._displayedFilms.slice(0, this._showingFilmsCount).forEach((film) => {
      const filmController = new MovieController(this._filmsListContainer, this._dataChangeHandler, this._viewChangeHandler);
      filmController.render(film);
    });
  }

  renderExtraFilms() {
    if (!this._filmsListExtraContainer) {
      return;
    }
    this._filmsListExtraContainer.innerHTML = ``;
    this._mostCommentedFilms = this._filmsModel.getMostCommentedMovies();
    this._topRatedFilms = this._filmsModel.getTopRatedMovies();

    if (this._mostCommentedFilms.length > 0) {
      render(this._filmsListExtraContainer, new ExtraFilmsComponent(`Most commented`), RenderPosition.BEFOREEND);
    }

    if (this._topRatedFilms.length > 0) {
      render(this._filmsListExtraContainer, new ExtraFilmsComponent(`Top rated movies`), RenderPosition.BEFOREEND);
    }

    const renderExtra = (filmsListContainer, movies) => {
      movies.forEach((movie) => {
        const filmController = new MovieController(filmsListContainer, this._dataChangeHandler, this._viewChangeHandler);
        filmController.render(movie);
      });
    };

    const filmsListExtraContainers = document.querySelectorAll(`.films-list--extra .films-list__container`);
    renderExtra(filmsListExtraContainers[0], this._topRatedFilms);
    renderExtra(filmsListExtraContainers[1], this._mostCommentedFilms);
  }

  render() {
    const container = this._container.getElement();
    const films = this._filmsModel.getMovies();

    this._showingFilmsCount = SHOWING_FILMS_ON_START;
    this._displayedFilms = films;

    if (this._noFilmsComponent) {
      remove(this._noFilmsComponent);
    }

    if (!films.length) {
      this._noFilmsComponent = new NoFilmsComponent(this._isLoading);
      render(container, this._noFilmsComponent, RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.BEFOREEND);

    const filmsContainer = this._filmsContainerComponent;
    render(container, filmsContainer, RenderPosition.BEFOREEND);

    const filmsList = this._filmsListComponent;
    render(filmsContainer.getElement(), filmsList, RenderPosition.BEFOREEND);

    this._filmsListContainer = filmsList.getElement().querySelector(`.films-list__container`);
    this._filmsListExtraContainer = filmsList.getElement().querySelector(`.films-list__extra-container`);

    this.renderFilms();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      this._filmsModel.setSorting(sortType);
      this._displayedFilms = this._filmsModel.getMovies();
      this.renderFilms();
    });

    this._renderShowMoreButton();

    this.renderExtraFilms();
  }

  show() {
    this._container.show();
  }

  hide() {
    this._container.hide();
  }

  setLoadingState(isLoading) {
    this._isLoading = isLoading;
  }

  _renderShowMoreButton() {
    if (this._displayedFilms.length > SHOWING_FILMS_ON_START) {
      render(this._filmsListContainer, this._showMoreButtonComponent, RenderPosition.AFTER);
    } else {
      remove(this._showMoreButtonComponent);
      return;
    }

    this._showMoreButtonComponent.setClickHandler(() => {
      this._showingFilmsCount += ADDED_FILMS_BY_BUTTON;
      this.renderFilms();

      if (this._showingFilmsCount >= this._displayedFilms.length) {
        remove(this._showMoreButtonComponent);
      }
    });
  }

  _dataChangeHandler(oldFilm, newFilm) {
    this._api.updateMovie(oldFilm.id, newFilm)
      .then((film) => {
        this._filmsModel.updateMovie(film.id, film);
        this._displayedFilms = this._filmsModel.getMovies();

        this.renderFilms();
        this.renderExtraFilms();
        this._movieDetailsController.render(film);
        this._renderShowMoreButton();
      });
  }

  _viewChangeHandler(film) {
    this._movieDetailsController.render(film);
    this._movieDetailsController.openPopup();
  }

  _filterChangeHandler() {
    this._displayedFilms = this._filmsModel.getMovies();
    this._showingFilmsCount = SHOWING_FILMS_ON_START;
    this._renderShowMoreButton();
    this.renderFilms();
  }
}
