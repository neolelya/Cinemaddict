import {SortType} from '../components/sort';

export const FilterName = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
};

const EXTRA_FILMS_QUANTITY = 2;

export default class Movies {
  constructor() {
    this._movies = [];
    this._activeFilter = FilterName.ALL;
    this._activeSortType = SortType.DEFAULT;
  }

  getMovies() {
    let movies;
    switch (this._activeFilter) {
      case FilterName.WATCHLIST:
        movies = this._movies.filter((it) => it.isWatchlist);
        break;
      case FilterName.HISTORY:
        movies = this._movies.filter((it) => it.isHistory);
        break;
      case FilterName.FAVORITES:
        movies = this._movies.filter((it) => it.isFavorites);
        break;
      case FilterName.ALL:
      default:
        movies = this._movies;
        break;
    }

    switch (this._activeSortType) {
      case SortType.RATING:
        movies.sort((a, b) => b.rating - a.rating);
        break;
      case SortType.DATE:
        movies.sort((a, b) => b.releaseDate - a.releaseDate);
        break;
    }

    return movies;
  }

  setMovies(movie) {
    this._movies = Array.from(movie);
  }

  getFilter() {
    const filters = {};
    for (const filterName of Object.values(FilterName)) {
      filters[filterName] = {
        name: filterName,
        count: this._movies.filter((film) => film[`is${filterName[0].toUpperCase()}${filterName.slice(1)}`]).length,
        isActive: this._activeFilter === filterName,
      };
    }

    return filters;
  }

  setFilter(filterName) {
    this._activeFilter = filterName;
    if (this._filterChangeHandler) {
      this._filterChangeHandler();
    }
  }

  onFilterChange(handler) {
    this._filterChangeHandler = handler;
  }

  getTopRatedMovies() {
    return this._movies
      .filter((movie) => movie.rating > 0)
      .sort((first, second) => second.rating - first.rating)
      .slice(0, EXTRA_FILMS_QUANTITY);
  }

  getMostCommentedMovies() {
    return this._movies
      .filter((movie) => movie.comments.length > 0)
      .sort((first, second) => second.comments.length - first.comments.length)
      .slice(0, EXTRA_FILMS_QUANTITY);
  }

  setSorting(sortType) {
    this._activeSortType = sortType;
  }

  updateMovie(id, newMovie) {
    const index = this._movies.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._movies = [].concat(this._movies.slice(0, index), newMovie, this._movies.slice(index + 1));

    if (this._moviesUpdateHandler) {
      this._moviesUpdateHandler();
    }

    return true;
  }

  onMoviesUpdate(handler) {
    this._moviesUpdateHandler = handler;
  }
}
