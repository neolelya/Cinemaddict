import UserProfileComponent from '../components/profile-rating';
import {getProfileRank} from '../models/profile';
import {render, RenderPosition, replace} from '../utils/render';


export default class UserProfileController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._profileComponent = null;

    moviesModel.moviesUpdateHandler(() => this.render());
  }

  render() {
    const oldComponent = this._profileComponent;
    const watchedMoviesQuantity = this._moviesModel.getMoviesNumber(this._moviesModel.getMovies().filter((movie) => movie.isHistory));
    this._profileComponent = new UserProfileComponent(getProfileRank(watchedMoviesQuantity));

    if (oldComponent) {
      replace(this._profileComponent, oldComponent);
    } else {
      render(this._container, this._profileComponent, RenderPosition.BEFOREEND);
    }
  }
}

