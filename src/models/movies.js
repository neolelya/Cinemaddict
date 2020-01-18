import {SortType} from '../components/sort';
import moment from 'moment';

export const FilterName = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
};

export const Period = {
  ALL_TIME: moment(new Date(0)),
  TODAY: moment().subtract(1, `days`),
  WEEK: moment().subtract(1, `weeks`),
  MONTH: moment().subtract(1, `months`),
  YEAR: moment().subtract(1, `years`),
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
        movies = [...movies].sort((a, b) => b.totalRating - a.totalRating);
        break;
      case SortType.DATE:
        movies = [...movies].sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
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
      .filter((movie) => movie.totalRating > 0)
      .sort((first, second) => second.totalRating - first.totalRating)
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

  getMoviesNumber(movies) {
    return movies
      .filter((movie) => movie.isHistory)
      .length;
  }

  getUserMoviesStats(period) {
    const moviesFromPeriod = this._movies.filter((movie) => new Date(movie.watchingDate) > period);

    return {
      moviesNumber: this.getMoviesNumber(moviesFromPeriod),
      duration: this._getMoviesDuration(moviesFromPeriod),
      genres: this._getMoviesGenres(moviesFromPeriod)
    };
  }

  _getMoviesDuration(movies) {
    return movies
      .filter((movie) => movie.isHistory)
      .reduce((acc, it) => {
        return acc + it.runtime;
      }, 0);
  }

  _getMoviesGenres(movies) {
    const genresCounter = {};
    const genres = [];
    movies
      .filter((movie) => movie.isHistory)
      .forEach((movie) => {
        const genresArray = Array.from(movie.genre.keys());
        genresArray.forEach((genre) => {
          genresCounter[genre] = (genresCounter[genre] || 0) + 1;
        });
      });
    Object.keys(genresCounter).forEach((genre) => {
      genres.push({name: genre, moviesNumber: genresCounter[genre]});
    });
    return genres.sort((a, b) => b.moviesNumber - a.moviesNumber);
  }
}
