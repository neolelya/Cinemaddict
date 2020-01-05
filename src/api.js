import Movie from './models/movie';
import Comments from './models/comments';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(url, authorization) {
    this._url = url;
    this._authorization = authorization;
  }

  getMovies() {
    return this._load({url: `/movies`})
      .then((response) => response.json())
      .then(Movie.parseMovies);
  }

  getComments(movie) {
    return this._load({url: `/comments/${movie.id}`})
      .then((response) => response.json())
      .then(Comments.parseComments);
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

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._url}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((error) => {
        throw error;
      });
  }
}
