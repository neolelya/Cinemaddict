import FilmComponent from '../components/film';
import FilmDetailsComponent from '../components/film-details';
import {render, replace, RenderPosition} from '../utils/render';

const Mode = {
  DEFAULT: `default`,
  DETAILS: `details`
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._filmComponent = null;
    this._filmDetailsComponent = null;

    this._closePopup = this._closePopup.bind(this);
    this._onEscKeydown = this._onEscKeydown.bind(this);
  }

  render(film) {
    const oldFilmComponent = this._filmComponent;
    const oldFilmDetailsComponent = this._filmDetailsComponent;

    this._filmComponent = new FilmComponent(film);
    this._filmDetailsComponent = new FilmDetailsComponent(film);

    this._filmComponent.setDetailClickHandler(() => {
      this._openPopup();
    });

    this._filmComponent.setWatchlistClickHandler(() => {
      this._onDataChange(film, Object.assign({}, film, {
        userDetails: Object.assign({}, film.userDetails, {
          isWatchlist: !film.userDetails.isWatchlist,
        })
      }));
    });

    this._filmComponent.setAlreadyWatchedClickHandler(() => {
      this._onDataChange(film, Object.assign({}, film, {
        userDetails: Object.assign({}, film.userDetails, {
          isHistory: !film.userDetails.isHistory,
        })
      }));
    });

    this._filmComponent.setFavoriteClickHandler(() => {
      this._onDataChange(film, Object.assign({}, film, {
        userDetails: Object.assign({}, film.userDetails, {
          isFavorites: !film.userDetails.isFavorites,
        })
      }));
    });

    this._filmDetailsComponent.setWatchlistClickHandler(() => {
      this._onDataChange(film, Object.assign({}, film, {
        userDetails: Object.assign({}, film.userDetails, {
          isWatchlist: !film.userDetails.isWatchlist,
        })
      }));
    });

    this._filmDetailsComponent.setAlreadyWatchedClickHandler(() => {
      this._onDataChange(film, Object.assign({}, film, {
        userDetails: Object.assign({}, film.userDetails, {
          isHistory: !film.userDetails.isHistory,
        })
      }));
    });

    this._filmDetailsComponent.setFavoriteClickHandler(() => {
      this._onDataChange(film, Object.assign({}, film, {
        userDetails: Object.assign({}, film.userDetails, {
          isFavorites: !film.userDetails.isFavorites,
        })
      }));
    });

    this._filmDetailsComponent.setDeleteCommentHandler((index) => {
      this._onDataChange(film, Object.assign({}, film, {
        comments: [].concat(film.comments.slice(0, index), film.comments.slice(index + 1))
      }));
    });

    this._filmDetailsComponent.setClosePopupClickHandler(this._closePopup);
    this._filmDetailsComponent.setCommentHandler((newComment) => {
      this._onDataChange(film, Object.assign({}, film, {
        comments: [].concat(film.comments, newComment)
      }));
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

  _openPopup() {
    this._onViewChange();

    document.body.classList.add(`hide-overflow`);
    document.body.appendChild(this._filmDetailsComponent.getElement());
    document.addEventListener(`keydown`, this._onEscKeydown);

    this._mode = Mode.DETAILS;
  }

  _closePopup() {
    document.body.classList.remove(`hide-overflow`);
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

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }
}
