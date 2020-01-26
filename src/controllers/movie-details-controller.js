import Movie from '../models/movie';
import FilmDetailsComponent from '../components/film-details';
import {replace} from '../utils/render';

const HIDE_OVERFLOW_CLASS = `hide-overflow`;

export default class MovieDetailsController {
  constructor(dataChangeHandler, api) {
    this._dataChangeHandler = dataChangeHandler;
    this._api = api;

    this._movie = null;
    this._movieComments = [];
    this._filmDetailsComponent = null;
    this._isCommentsLoaded = false;
    this._isOpened = false;

    this._closePopup = this._closePopup.bind(this);
    this._escKeydownHandler = this._escKeydownHandler.bind(this);
  }

  render(movie) {
    this._movie = movie;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmDetailsComponent = new FilmDetailsComponent(movie, this._movieComments);

    this._filmDetailsComponent.setWatchlistClickHandler(() => {
      const newMovie = Movie.cloneMovie(movie);
      newMovie.isWatchlist = !newMovie.isWatchlist;

      this._dataChangeHandler(movie, newMovie);
    });

    this._filmDetailsComponent.setAlreadyWatchedClickHandler(() => {
      const newMovie = Movie.cloneMovie(movie);
      newMovie.isHistory = !newMovie.isHistory;
      newMovie.watchingDate = new Date();

      this._dataChangeHandler(movie, newMovie);
    });

    this._filmDetailsComponent.setFavoriteClickHandler(() => {
      const newMovie = Movie.cloneMovie(movie);
      newMovie.isFavorites = !newMovie.isFavorites;

      this._dataChangeHandler(movie, newMovie);
    });

    this._filmDetailsComponent.setDeleteCommentHandler((id) => {
      this._api.deleteComment(id)
        .then(() => {
          this._movieComments = this._movieComments.filter((comment) => comment.id !== id);
          this.render(this._movie);
          this._dataChangeHandler(movie, this._movie);
        });
    });

    this._filmDetailsComponent.setRatingHandler((evt) => {
      const newRating = parseInt(evt.target.value, 10);
      const newMovie = Movie.cloneMovie(movie);
      newMovie.personalRating = newRating;

      this._api.updateMovie(this._movie.id, newMovie)
        .then(() => this._dataChangeHandler(this._movie, newMovie))
        .catch(() => this._filmDetailsComponent.errorRatingSubmitHandler());
    });

    this._filmDetailsComponent.setResetRatingHandler((evt) => {
      evt.preventDefault();

      const newMovie = Movie.cloneMovie(movie);
      newMovie.personalRating = 0;
      newMovie.isHistory = !newMovie.isHistory;

      this._dataChangeHandler(this._movie, newMovie);
    });

    this._filmDetailsComponent.setClosePopupClickHandler(this._closePopup);

    this._filmDetailsComponent.setCommentHandler((newComment) => {
      this._api.createComment(this._movie.id, newComment)
        .then(({movie: newMovie, comments}) => {
          this._movieComments = comments;
          this._dataChangeHandler(this._movie, newMovie);
        })
        .catch(() => this._filmDetailsComponent.errorCommentSubmitHandler());
    });

    if (oldFilmDetailsComponent && this._isOpened) {
      this._filmDetailsComponent.disableAnimation();
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    }
  }

  openPopup() {
    this._api.getComments(this._movie.id)
      .then((comments) => {
        this._movieComments = comments;
        this.render(this._movie);
        this._isCommentsLoaded = true;
      });

    document.body.classList.add(HIDE_OVERFLOW_CLASS);
    document.body.appendChild(this._filmDetailsComponent.getElement());
    document.addEventListener(`keydown`, this._escKeydownHandler);

    if (!this._isCommentsLoaded) {
      const commentsTitle = this._filmDetailsComponent.getElement().querySelector(`.film-details__comments-title`);
      commentsTitle.innerHTML = `Comments are loading...`;
    }

    this._isOpened = true;
  }

  _closePopup() {
    document.body.classList.remove(HIDE_OVERFLOW_CLASS);
    document.body.removeChild(this._filmDetailsComponent.getElement());
    document.removeEventListener(`keydown`, this._escKeydownHandler);

    this._filmDetailsComponent.enableAnimation();

    this._isOpened = false;
  }

  _escKeydownHandler(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closePopup();
    }
  }
}
