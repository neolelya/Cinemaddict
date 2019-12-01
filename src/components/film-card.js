export const createFilmCardTemplate = (filmData) => {
  return (
    `<article class="film-card">
        <h3 class="film-card__title">${filmData.title}</h3>
        <p class="film-card__rating">${filmData.rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${filmData.year}</span>
          <span class="film-card__duration">${filmData.duration}</span>
          <span class="film-card__genre">${filmData.genre}</span>
        </p>
        <img src="${filmData.poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${filmData.description}</p>
        <a class="film-card__comments">
            ${filmData.comments.length} comment${filmData.comments.length > 1 ? `s` : ``}
        </a>
        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"></button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"></button>
          <button class="film-card__controls-item button film-card__controls-item--favorite"></button>
        </form>
    </article>`
  );
};
