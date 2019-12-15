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
    const oldFilmComponent = this._filmComponent ? this._filmComponent : null;

    this._filmComponent = new FilmComponent(film);
    this._filmDetailsComponent = new FilmDetailsComponent(film);

    this._filmComponent.setDetailClickHandler(() => {
      this._openPopup();
    });

    this._filmComponent.setWatchlistClickHandler(() => {
      this._onDataChange(film, Object.assign({}, film, {
        isWatchlist: !film.isWatchlist,
      }));
    });

    this._filmComponent.setAlreadyWatchedClickHandler(() => {
      this._onDataChange(film, Object.assign({}, film, {
        isHistory: !film.isHistory,
      }));
    });

    this._filmComponent.setFavoriteClickHandler(() => {
      this._onDataChange(film, Object.assign({}, film, {
        isFavorites: !film.isFavorites,
      }));
    });

    if (oldFilmComponent) {
      replace(this._filmComponent, oldFilmComponent);
    } else {
      render(this._container, this._filmComponent, RenderPosition.BEFOREEND);
    }
  }

  _openPopup() {
    this._onViewChange();

    document.body.appendChild(this._filmDetailsComponent.getElement());
    document.addEventListener(`keydown`, this._onEscKeydown);

    this._filmDetailsComponent.setClosePopupClickHandler(this._closePopup);

    this._mode = Mode.DETAILS;
  }

  _closePopup() {
    document.body.removeChild(this._filmDetailsComponent.getElement());
    document.removeEventListener(`keydown`, this._onEscKeydown);

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
