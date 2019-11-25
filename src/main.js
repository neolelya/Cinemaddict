'use strict';

const FILMS_COUNT = 5;
const EXTRA_COUNT = 2;

const createProfileTemplate = () => {
  return (
    `<section class="header__profile profile">
        <p class="profile__rating"></p>
        <img class="profile__avatar" src="#" alt="Avatar" width="35" height="35">
    </section>`
  );
};

const createNavigationTemplate = () => {
  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active"></a>
      <a href="#watchlist" class="main-navigation__item"><span class="main-navigation__item-count"></span></a>
      <a href="#history" class="main-navigation__item"><span class="main-navigation__item-count"></span></a>
      <a href="#favorites" class="main-navigation__item"><span class="main-navigation__item-count"></span></a>
      <a href="#stats" class="main-navigation__item main-navigation__item--additional"></a>
    </nav>`
  );
};

const createSortingTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" class="sort__button sort__button--active"></a></li>
      <li><a href="#" class="sort__button"></a></li>
      <li><a href="#" class="sort__button"></a></li>
    </ul>`
  );
};

const createFilmCardsContainerTemplate = () => {
  return (
    `<section class="films">
        <section class="films-list">
        <h2 class="films-list__title visually-hidden"></h2>

        <div class="films-list__container">
        </div>
    </section>`
  );
};

const createShowMoreButtonTemplate = () => {
  return (
    `<button class="films-list__show-more"></button>`
  );
};

const createFilmCardsExtraContainerTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title"></h2>

      <div class="films-list__container">
      </div>
    </section>`
  );
};

const createFilmCardTemplate = () => {
  return (
    `<article class="film-card">
        <h3 class="film-card__title"></h3>
        <p class="film-card__rating"></p>
        <p class="film-card__info">
          <span class="film-card__year"></span>
          <span class="film-card__duration"></span>
          <span class="film-card__genre"></span>
        </p>
        <img src="#" alt="" class="film-card__poster">
        <p class="film-card__description"></p>
        <a class="film-card__comments"></a>
        <form class="film-card__controls">
          <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist"></button>
          <button class="film-card__controls-item button film-card__controls-item--mark-as-watched"></button>
          <button class="film-card__controls-item button film-card__controls-item--favorite"></button>
        </form>
    </article>`
  );
};

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, createProfileTemplate(), `beforeend`);
render(siteMainElement, createNavigationTemplate(), `beforeend`);
render(siteMainElement, createSortingTemplate(), `beforeend`);
render(siteMainElement, createFilmCardsContainerTemplate(), `beforeend`);

const filmsListContainer = document.querySelector(`.films-list__container`);

new Array(FILMS_COUNT)
  .fill(``)
  .forEach(() => render(filmsListContainer, createFilmCardTemplate(), `beforeend`));

render(filmsListContainer, createShowMoreButtonTemplate(), `afterend`);

new Array(EXTRA_COUNT)
  .fill(``)
  .forEach(() => render(siteMainElement, createFilmCardsExtraContainerTemplate(), `beforeend`));

const filmsListExtraContainer = document.querySelectorAll(`.films-list--extra .films-list__container`);
filmsListExtraContainer.forEach((it) => {
  render(it, createFilmCardTemplate(), `beforeend`);
});
