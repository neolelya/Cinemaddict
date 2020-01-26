const UserRank = {
  NOVICE: 1,
  FAN: 11,
  MOVIE_BUFF: 21,
};

export const getProfileRank = (watchedFilmsNumber) => {
  switch (true) {
    case (watchedFilmsNumber >= UserRank.NOVICE && watchedFilmsNumber < UserRank.FAN):
      return `Novice`;
    case (watchedFilmsNumber >= UserRank.FAN && watchedFilmsNumber < UserRank.MOVIE_BUFF):
      return `Fan`;
    case (watchedFilmsNumber >= UserRank.MOVIE_BUFF):
      return `Movie Buff`;
    default:
      return ``;
  }
};
