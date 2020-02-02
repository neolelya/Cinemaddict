import Movie from '../models/movie';
import Comments from '../models/comments';

const SuccessfulClientRequestRange = {
  MIN: 200,
  MAX: 299
};

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= SuccessfulClientRequestRange.MIN && response.status <= SuccessfulClientRequestRange.MAX) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class Api {
  constructor(url, authorization) {
    this._url = url;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({url: `/movies`})
      .then((response) => response.json())
      .then(Movie.parseMovies);
  }

  getComments(movieId) {
    return this._load({url: `/comments/${movieId}`})
      .then((response) => response.json())
      .then(Comments.parseComments);
  }

  createComment(movieId, comment) {
    return this._load({
      url: `/comments/${movieId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then((newData) => ({
        movie: Movie.parseMovie(newData.movie),
        comments: Comments.parseComments(newData.comments),
      }));
  }

  deleteComment(id) {
    return this._load({url: `/comments/${id}`, method: Method.DELETE});
  }

  updateMovie(id, movie) {
    return this._load({
      url: `/movies/${id}`,
      method: Method.PUT,
      body: JSON.stringify(movie.toJSONFormat()),
      headers: new Headers({'Content-Type': `application/json`})
    })
      .then((response) => response.json())
      .then(Movie.parseMovie);
  }

  sync(data) {
    return this._load({
      url: `/movies/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`})
    }).then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._url}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((error) => {
        throw error;
      });
  }
}
