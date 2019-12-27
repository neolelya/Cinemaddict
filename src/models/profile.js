export const getProfileRating = (watchedFilmsNumber) => {
  switch (true) {
    case (watchedFilmsNumber === 0):
      return ` `;
    case (watchedFilmsNumber >= 1 && watchedFilmsNumber < 11):
      return `Novice`;
    case (watchedFilmsNumber >= 11 && watchedFilmsNumber < 21):
      return `Fan`;
    default:
      return `Movie Buff`;
  }
};
