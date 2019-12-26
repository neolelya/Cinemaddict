import MenuFilters from '../components/filters';
import {render, RenderPosition, replace} from '../utils/render';

export default class FilterController {
  constructor(container, movies) {
    this._container = container;
    this._movies = movies;
    this._filters = null;

    movies.onMoviesUpdate(() => this.render());
  }

  render() {
    const oldComponent = this._filters;
    this._filters = new MenuFilters(this._movies.getFilter());
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
}
