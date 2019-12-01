const getProfileRating = (watchedFilmsNumber) => {
  if (watchedFilmsNumber === 0) {
    return ``;
  } if (watchedFilmsNumber >= 1 && watchedFilmsNumber < 11) {
    return `Novice`;
  } if (watchedFilmsNumber >= 11 && watchedFilmsNumber < 21) {
    return `Fan`;
  } else {
    return `Movie Buff`;
  }
};

export const createUserProfileTemplate = (watchedFilmsNumber) => {
  return (
    `<section class="header__profile profile">
        <p class="profile__rating">${getProfileRating(watchedFilmsNumber)}</p>
        <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};
