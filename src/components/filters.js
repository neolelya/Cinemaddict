import AbstractComponent from './abstract-component';

const createFiltersTemplate = (data) => {
  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">${data.watchlist.name[0].toUpperCase()}${data.watchlist.name.slice(1)} <span class="main-navigation__item-count">${data.watchlist.count}</span></a>
      <a href="#history" class="main-navigation__item">${data.history.name[0].toUpperCase()}${data.history.name.slice(1)} <span class="main-navigation__item-count">${data.history.count}</span></a>
      <a href="#favorites" class="main-navigation__item">${data.favorites.name[0].toUpperCase()}${data.favorites.name.slice(1)} <span class="main-navigation__item-count">${data.favorites.count}</span></a>
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
}
