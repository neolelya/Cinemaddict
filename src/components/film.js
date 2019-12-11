import AbstractComponent from './abstract-component';

const createFilmTemplate = ({title, rating, year, duration, genre, poster, description, comments}) => {
  return (
    `<article class="film-card">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${year}</span>
          <span class="film-card__duration">${duration}</span>
          <span class="film-card__genre">${genre}</span>
        </p>
        <img src="${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${description}</p>
        <a class="film-card__comments">
            ${comments.length} comment${comments.length > 1 ? `s` : ``}
        </a>
        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"></button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"></button>
          <button class="film-card__controls-item button film-card__controls-item--favorite"></button>
        </form>
    </article>`
  );
};

export default class Film extends AbstractComponent {
  constructor(film) {
    super();
    this._film = film;
  }

  getTemplate() {
    return createFilmTemplate(this._film);
  }

  setDetailClickHandler(handler) {
    this.getElement()
      .querySelectorAll(`.film-card__title, .film-card__poster, .film-card__comments`)
      .forEach((element) => element.addEventListener(`click`, handler));
  }
}
