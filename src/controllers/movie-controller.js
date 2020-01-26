import Movie from '../models/movie';
import FilmComponent from '../components/film';
import {render, replace, RenderPosition} from '../utils/render';

export default class MovieController {
  constructor(container, dataChangeHandler, viewChangeHandler) {
    this._container = container;
    this._dataChangeHandler = dataChangeHandler;
    this._viewChangeHandler = viewChangeHandler;

    this._filmComponent = null;
  }

  render(movie) {
    const oldFilmComponent = this._filmComponent;

    this._filmComponent = new FilmComponent(movie);

    this._filmComponent.setDetailClickHandler(() => this._viewChangeHandler(movie));

    this._filmComponent.setWatchlistClickHandler(() => {
      const newMovie = Movie.cloneMovie(movie);
      newMovie.isWatchlist = !newMovie.isWatchlist;

      this._dataChangeHandler(movie, newMovie);
    });

    this._filmComponent.setAlreadyWatchedClickHandler(() => {
      const newMovie = Movie.cloneMovie(movie);
      newMovie.isHistory = !newMovie.isHistory;
      newMovie.watchingDate = new Date();

      this._dataChangeHandler(movie, newMovie);
    });

    this._filmComponent.setFavoriteClickHandler(() => {
      const newMovie = Movie.cloneMovie(movie);
      newMovie.isFavorites = !newMovie.isFavorites;

      this._dataChangeHandler(movie, newMovie);
    });

    if (oldFilmComponent) {
      replace(this._filmComponent, oldFilmComponent);
    } else {
      render(this._container, this._filmComponent, RenderPosition.BEFOREEND);
    }
  }
}
