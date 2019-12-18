import {getRandomIntegerNumber, getRandomArrayItem} from '../utils/utils';

const TITLES = [
  `The Irishman`,
  `Once Upon a Time... in Hollywood`,
  `Doctor Sleep`,
  `Abominable`,
  `His Dark Materials`,
  `The Peanut Butter Falcon`,
  `Motherless Brooklyn`,
  `Where'd You Go, Bernadette`,
  `Charlie's Angels`,
  `Goodfellas`,
  `A Rainy Day in New York`,
  `Crawl`,
  `The Witcher`,
  `Angel Has Fallen`,
  `The Courier`
];

const POSTERS = [
  `/images/posters/made-for-each-other.png`,
  `/images/posters/popeye-meets-sinbad.png`,
  `/images/posters/sagebrush-trail.jpg`,
  `/images/posters/santa-claus-conquers-the-martians.jpg`,
  `/images/posters/the-dance-of-life.jpg`,
  `/images/posters/the-great-flamarion.jpg`,
  `/images/posters/the-man-with-the-golden-arm.jpg`
];

const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`
];

const PEOPLES = [
  `Anthony Mann`,
  `Heinz Herald`,
  `Anne Wigton`,
  `Richard Weil`,
  `Erich von Stroheim`,
  `Mary Beth Hughes`,
  `Dan Duryea`
];

const COUNTRIES = [`USA`, `UK`, `Spain`, `Russia`, `Italy`, `Canada`, `Hungary`];

const GENRES = [`Musical`, `Drama`, `Comedy`, `Cartoon`, `Western`, `Series`, `Film-Noir`, `Mystery`];

const AGES = [`18+`, `10+`, `8+`, `2+`];

const EMOJIES = [
  `/images/emoji/smile.png`,
  `/images/emoji/sleeping.png`,
  `/images/emoji/puke.png`,
  `/images/emoji/angry.png`
];

const getRandomDescription = () => {
  return new Array(getRandomIntegerNumber(1, 3))
    .fill(``)
    .map(() => getRandomArrayItem(DESCRIPTIONS))
    .join(` `);
};

const getRandomDuration = () => {
  return getRandomIntegerNumber(3600000, 18000000);
};

const getRandomActors = () => {
  return new Array(getRandomIntegerNumber(1, 5))
    .fill(``)
    .map(() => getRandomArrayItem(PEOPLES))
    .join(` `);
};

const getRandomDate = () => {
  const startDate = new Date(1950, 0, 1);
  const endDate = new Date();

  return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
};

const getRandomCommentDate = () => {
  const startDate = new Date(2000, 0, 1);
  const endDate = new Date();

  return new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
};

const getRandomGenres = (genres) => {
  return genres
    .filter(() => Math.random() > 0.5)
    .slice(0, 3);
};

const generateFilm = () => {
  return {
    title: getRandomArrayItem(TITLES),
    rating: `${getRandomIntegerNumber(5, 9)}.${getRandomIntegerNumber(0, 9)}`,
    duration: getRandomDuration(),
    poster: getRandomArrayItem(POSTERS),
    description: getRandomDescription(),
    comments: generateComments(getRandomIntegerNumber(0, 20)),
    director: getRandomArrayItem(PEOPLES),
    writer: getRandomArrayItem(PEOPLES),
    actors: getRandomActors(),
    releaseDate: getRandomDate(),
    country: getRandomArrayItem(COUNTRIES),
    genres: new Set(getRandomGenres(GENRES)),
    age: getRandomArrayItem(AGES),
    isWatchlist: Math.random() > 0.5,
    isHistory: Math.random() > 0.5,
    isFavorites: Math.random() > 0.5,
  };
};

const generateComment = () => {
  return {
    emoji: getRandomArrayItem(EMOJIES),
    comment: getRandomArrayItem(DESCRIPTIONS),
    userName: getRandomArrayItem(PEOPLES),
    date: getRandomCommentDate()
  };
};

const generateComments = (quantity) => {
  return new Array(quantity)
    .fill(``)
    .map(() => generateComment())
    .sort((first, second) => {
      return first.date - second.date;
    });
};

const generateFilms = (quantity) => {
  return new Array(quantity)
    .fill(``)
    .map(() => generateFilm());
};

export {generateFilm, generateFilms, generateComments};
