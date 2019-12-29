import Statistics from '../components/statistics';
import {Period} from '../models/movies';
import {render, RenderPosition, replace} from '../utils/render';
import {getProfileRank} from '../models/profile';

export default class StatisticsController {
  constructor(container, moviesModel, profileRank) {
    this._container = container;
    this._moviesModel = moviesModel;
    this._profileRank = profileRank;

    this._statistics = null;
    this._period = Period.ALL_TIME;
  }

  render() {
    const oldComponent = this._statistics;
    this._statistics = new Statistics(this._moviesModel.getUserMoviesStats(this._period), getProfileRank(this._profileRank));
    this._statistics.setCheckedPeriod(this._period);

    this._statistics.setChangePeriod((period) => {
      this._period = period;
      this.render();
    });

    if (oldComponent) {
      replace(this._statistics, oldComponent);
    } else {
      render(this._container, this._statistics, RenderPosition.BEFOREEND);
    }
  }

  show() {
    if (this._statistics) {
      this._statistics.show();
    }
  }

  hide() {
    if (this._statistics) {
      this._statistics.hide();
    }
  }
}
