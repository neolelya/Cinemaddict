import AbstractComponent from './abstract-component';
import {FilterName} from '../models/movies';

const createFiltersTemplate = (data) => {
  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item ${data[FilterName.ALL].isActive ? `main-navigation__item--active` : ``}">All movies</a>
      <a href="#watchlist" class="main-navigation__item ${data[FilterName.WATCHLIST].isActive ? `main-navigation__item--active` : ``}">${data.watchlist.name[0].toUpperCase()}${data.watchlist.name.slice(1)} <span class="main-navigation__item-count">${data.watchlist.count}</span></a>
      <a href="#history" class="main-navigation__item ${data[FilterName.HISTORY].isActive ? `main-navigation__item--active` : ``}">${data.history.name[0].toUpperCase()}${data.history.name.slice(1)} <span class="main-navigation__item-count">${data.history.count}</span></a>
      <a href="#favorites" class="main-navigation__item ${data[FilterName.FAVORITES].isActive ? `main-navigation__item--active` : ``}">${data.favorites.name[0].toUpperCase()}${data.favorites.name.slice(1)} <span class="main-navigation__item-count">${data.favorites.count}</span></a>
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>`
  );
};

export default class MenuFilters extends AbstractComponent {
  constructor(data) {
    super();
    this._data = data;
  }

  getTemplate() {
    return createFiltersTemplate(this._data);
  }

  setActiveFilterClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      const href = (evt.target.href || ``).split(`#`)[1];

      if (evt.target.tagName !== `A` || href === `stats`) {
        return;
      }

      handler(href);
    });
  }
}
