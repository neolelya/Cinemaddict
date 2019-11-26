import {createUserProfileTemplate} from './components/user-profile';
import {createMenuTemplate} from './components/menu';
import {createFilmCardsContainerTemplate} from './components/films-container';
import {createFilmCardTemplate} from './components/film-card';
import {createShowMoreButtonTemplate} from './components/show-more-button';
import {createFilmCardsExtraContainerTemplate} from './components/extra-films-container';
import {createFilmDetailsTemplate} from './components/film-details';

const FILMS_COUNT = 5;
const EXTRA_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = document.querySelector(`.header`);

render(siteHeaderElement, createUserProfileTemplate(), `beforeend`);
render(siteMainElement, createMenuTemplate(), `beforeend`);
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

const siteFooterElement = document.querySelector(`.footer`);
render(siteFooterElement, createFilmDetailsTemplate, `afterend`);
