import Movie from '../models/movie';

export default class Provider {
  constructor(api, storeMovies) {
    this._api = api;
    this._storeMovies = storeMovies;
    this._isSync = true;
  }

  getMovies() {
    if (this._isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          movies.forEach((movie) => this._storeMovies.setItem(movie.id, movie.toJSONFormat()));

          return Promise.resolve(movies);
        });
    } else {
      const storeMovies = Object.values(this._storeMovies.getAll());

      return Promise.resolve(Movie.parseMovies(storeMovies));
    }
  }

  getComments(id) {
    const [movie] = this._storeMovies.getItem(id);

    if (this._isOnline()) {
      return this._api.getComments(id)
        .then((comments) => {
          movie.commentsList = comments;
          this._storeMovies.setItem(id, movie);
          return comments;
        });
    }

    return Promise.resolve(movie.commentsList ? movie.commentsList : []);
  }

  updateMovie(id, newData) {
    if (this._isOnline()) {
      return this._api.updateMovie(id, newData);
    } else {
      this._storeMovies.setItem(id, newData.toJSONFormat());
      this._isSync = false;
      return Promise.resolve(newData);
    }
  }

  createComment(movieId, comment) {
    return this._api.createComment(movieId, comment);
  }

  deleteComment(commentId) {
    return this._api.deleteComment(commentId);
  }

  sync() {
    if (!this._isSync && this._isOnline()) {
      const data = Object.values(this._storeMovies.getAll());

      this._api.sync(data)
        .then((syncData) => {
          syncData.updated.forEach((movie) => this._storeMovies.setItem(movie.id, movie));
          this._isSync = true;
          return Promise.resolve([]);
        });
    }
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
