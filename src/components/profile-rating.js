import {createElement} from '../utils';

const getProfileRating = (watchedFilmsNumber) => {
  switch (true) {
    case (watchedFilmsNumber === 0):
      return ``;
    case (watchedFilmsNumber >= 1 && watchedFilmsNumber < 11):
      return `Novice`;
    case (watchedFilmsNumber >= 11 && watchedFilmsNumber < 21):
      return `Fan`;
    default:
      return `Movie Buff`;
  }
};

const createUserProfileTemplate = (watchedFilmsNumber) => {
  return (
    `<section class="header__profile profile">
        <p class="profile__rating">${getProfileRating(watchedFilmsNumber)}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class ProfileRating {
  constructor(watchedFilmsNumber) {
    this._element = null;
    this._watchedFilmsNumber = watchedFilmsNumber;
  }

  getTemplate() {
    return createUserProfileTemplate(this._watchedFilmsNumber);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
