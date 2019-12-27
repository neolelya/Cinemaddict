import AbstractComponent from './abstract-component';

const createUserProfileTemplate = (watchedFilmsNumber) => {
  return (
    `<section class="header__profile profile">
        <p class="profile__rating">${watchedFilmsNumber}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class ProfileRating extends AbstractComponent {
  constructor(watchedFilmsNumber) {
    super();
    this._watchedFilmsNumber = watchedFilmsNumber;
  }

  getTemplate() {
    return createUserProfileTemplate(this._watchedFilmsNumber);
  }
}
