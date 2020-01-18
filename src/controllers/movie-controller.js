import Movie from '../models/movie';
import FilmComponent from '../components/film';
import FilmDetailsComponent from '../components/film-details';
import {render, replace, RenderPosition} from '../utils/render';

const HIDE_OVERFLOW_CLASS = `hide-overflow`;

const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange, api) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._api = api;

    this._mode = Mode.DEFAULT;

    this._movie = null;
    this._movieComments = [];
    this._filmComponent = null;
    this._filmDetailsComponent = null;
    this._isCommentsLoaded = false;

    this._closePopup = this._closePopup.bind(this);
    this._onEscKeydown = this._onEscKeydown.bind(this);
  }

  render(movie) {
    this._movie = movie;
    const oldFilmComponent = this._filmComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmComponent(movie);
    this._filmDetailsComponent = new FilmDetailsComponent(movie, this._movieComments);

    this._filmComponent.setDetailClickHandler(() => {
      this._openPopup();
    });

    this._filmComponent.setWatchlistClickHandler(() => {
      const newMovie = Movie.cloneMovie(movie);
      newMovie.isWatchlist = !newMovie.isWatchlist;

      this._onDataChange(movie, newMovie);
    });

    this._filmComponent.setAlreadyWatchedClickHandler(() => {
      const newMovie = Movie.cloneMovie(movie);
      newMovie.isHistory = !newMovie.isHistory;
      if (!newMovie.isHistory) {
        newMovie.personalRating = 0;
      }

      this._onDataChange(movie, newMovie);
    });

    this._filmComponent.setFavoriteClickHandler(() => {
      const newMovie = Movie.cloneMovie(movie);
      newMovie.isFavorites = !newMovie.isFavorites;

      this._onDataChange(movie, newMovie);
    });

    this._filmDetailsComponent.setWatchlistClickHandler(() => {
      const newMovie = Movie.cloneMovie(movie);
      newMovie.isWatchlist = !newMovie.isWatchlist;

      this._onDataChange(movie, newMovie);
    });

    this._filmDetailsComponent.setAlreadyWatchedClickHandler(() => {
      const newMovie = Movie.cloneMovie(movie);
      newMovie.isHistory = !newMovie.isHistory;

      this._onDataChange(movie, newMovie);
    });

    this._filmDetailsComponent.setFavoriteClickHandler(() => {
      const newMovie = Movie.cloneMovie(movie);
      newMovie.isFavorites = !newMovie.isFavorites;

      this._onDataChange(movie, newMovie);
    });

    this._filmDetailsComponent.setDeleteCommentHandler((index) => {
      const id = this._movieComments[index].id;
      this._api.deleteComment(id)
        .then(() => {
          this._movieComments = [...this._movieComments.slice(0, index), ...this._movieComments.slice(index + 1)];
          this.render(this._movie);
          this._onDataChange(movie, this._movie);
        });
    });

    this._filmDetailsComponent.setRatingHandler((evt) => {
      const newRating = parseInt(evt.target.value, 10);
      const newMovie = Movie.cloneMovie(movie);
      newMovie.personalRating = newRating;

      this._api.updateMovie(this._movie.id, newMovie)
        .then(() => this._onDataChange(this._movie, newMovie))
        .catch(() => this._filmDetailsComponent.errorRatingSubmitHandler());
    });

    this._filmDetailsComponent.setResetRatingHandler((evt) => {
      evt.preventDefault();

      const newMovie = Movie.cloneMovie(movie);
      newMovie.personalRating = 0;
      newMovie.isHistory = !newMovie.isHistory;

      this._onDataChange(this._movie, newMovie);
    });

    this._filmDetailsComponent.setClosePopupClickHandler(this._closePopup);

    this._filmDetailsComponent.setCommentHandler((newComment) => {
      this._api.createComment(this._movie.id, newComment)
        .then(({movie: newMovie, comments}) => {
          this._movieComments = comments;
          this._onDataChange(this._movie, newMovie);
        })
        .catch(() => this._filmDetailsComponent.errorCommentSubmitHandler());
    });

    if (oldFilmComponent) {
      replace(this._filmComponent, oldFilmComponent);
    } else {
      render(this._container, this._filmComponent, RenderPosition.BEFOREEND);
    }

    if (oldFilmDetailsComponent && this._mode === Mode.DETAILS) {
      this._filmDetailsComponent.disableAnimation();
      replace(this._filmDetailsComponent, oldFilmDetailsComponent);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  _openPopup() {
    this._onViewChange();

    this._api.getComments(this._movie.id)
      .then((comments) => {
        this._movieComments = comments;
        this.render(this._movie);
        this._isCommentsLoaded = true;
      });

    document.body.classList.add(HIDE_OVERFLOW_CLASS);
    document.body.appendChild(this._filmDetailsComponent.getElement());
    document.addEventListener(`keydown`, this._onEscKeydown);

    if (!this._isCommentsLoaded) {
      const commentsTitle = this._filmDetailsComponent.getElement().querySelector(`.film-details__comments-title`);
      commentsTitle.innerHTML = `Comments are loading...`;
    }

    this._mode = Mode.DETAILS;
  }

  _closePopup() {
    document.body.classList.remove(HIDE_OVERFLOW_CLASS);
    document.body.removeChild(this._filmDetailsComponent.getElement());
    document.removeEventListener(`keydown`, this._onEscKeydown);

    this._filmDetailsComponent.enableAnimation();

    this._mode = Mode.DEFAULT;
  }

  _onEscKeydown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closePopup();
    }
  }
}
