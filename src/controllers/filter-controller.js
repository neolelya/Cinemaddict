import MenuFilters, {MenuType} from '../components/filters';
import {render, RenderPosition, replace} from '../utils/render';

export default class FilterController {
  constructor(container, movies) {
    this._container = container;
    this._movies = movies;

    this._filters = null;
    this._activeItem = MenuType.FILTER;

    movies.moviesUpdateHandler(() => this.render());
  }

  render() {
    const oldComponent = this._filters;
    this._filters = new MenuFilters(this._movies.getFilter(), this._activeItem);
    this._filters.setActiveFilterClickHandler((filterName) => {
      this._movies.setFilter(filterName);
      this.render();
    });

    if (oldComponent) {
      replace(this._filters, oldComponent);
    } else {
      render(this._container, this._filters, RenderPosition.BEFOREEND);
    }
  }

  setChangeMenuHandler(handler) {
    this._container.addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }

      const menuType = evt.target.dataset.menuType;

      this._activeItem = menuType;

      this.render();

      handler(menuType);
    });
  }
}
