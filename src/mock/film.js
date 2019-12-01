import {getRandomIntegerNumber, getRandomArrayItem} from '../utils';

const Titles = [
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

const Posters = [
  `/images/posters/made-for-each-other.png`,
  `/images/posters/popeye-meets-sinbad.png`,
  `/images/posters/sagebrush-trail.jpg`,
  `/images/posters/santa-claus-conquers-the-martians.jpg`,
  `/images/posters/the-dance-of-life.jpg`,
  `/images/posters/the-great-flamarion.jpg`,
  `/images/posters/the-man-with-the-golden-arm.jpg`
];

const Descriptions = [
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

const Peoples = [
  `Anthony Mann`,
  `Heinz Herald`,
  `Anne Wigton`,
  `Richard Weil`,
  `Erich von Stroheim`,
  `Mary Beth Hughes`,
  `Dan Duryea`
];

const Countries = [`USA`, `UK`, `Spain`, `Russia`, `Italy`, `Canada`, `Hungary`];

const Genres = [`Musical`, `Drama`, `Comedy`, `Cartoon`, `Western`, `Series`, `Film-Noir`, `Mystery`];

const Ages = [`18+`, `10+`, `8+`, `2+`];

const Emojies = [
  `./images/emoji/smile.png`,
  `./images/emoji/sleeping.png`,
  `./images/emoji/puke.png`,
  `./images/emoji/angry.png`
];

const getRandomDescription = () => {
  return new Array(getRandomIntegerNumber(1, 3))
    .fill(``)
    .map(() => getRandomArrayItem(Descriptions))
    .join(` `);
};

const getRandomDuration = () => {
  const randomDuration = getRandomIntegerNumber(0, 300);
  const durationHours = Math.floor(randomDuration / 60);
  const durationMinutes = randomDuration % 60;

  return (
    `${durationHours}h ${durationMinutes}m`
  );
};

const getRandomActors = () => {
  return new Array(getRandomIntegerNumber(1, 5))
    .fill(``)
    .map(() => getRandomArrayItem(Peoples))
    .join(` `);
};

const getRandomDate = () => {
  const startDate = new Date(1950, 0, 1);
  const endDate = new Date();
  const options = {
    day: `numeric`,
    month: `long`,
    year: `numeric`
  };

  return new Intl.DateTimeFormat(`en-GB`, options)
    .format(new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())));
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
    title: getRandomArrayItem(Titles),
    rating: `${getRandomIntegerNumber(5, 9)}.${getRandomIntegerNumber(0, 9)}`,
    year: getRandomIntegerNumber(1960, 2019),
    duration: getRandomDuration(),
    genre: getRandomArrayItem(Genres),
    poster: getRandomArrayItem(Posters),
    description: getRandomDescription(),
    comments: generateComments(getRandomIntegerNumber(0, 20)),
    director: getRandomArrayItem(Peoples),
    writer: getRandomArrayItem(Peoples),
    actors: getRandomActors(),
    releaseDate: getRandomDate(),
    country: getRandomArrayItem(Countries),
    genres: new Set(getRandomGenres(Genres)),
    age: getRandomArrayItem(Ages),
    isWatchlist: Math.random() > 0.5,
    isHistory: Math.random() > 0.5,
    isFavorites: Math.random() > 0.5,
  };
};

const generateComment = () => {
  return {
    emoji: getRandomArrayItem(Emojies),
    comment: getRandomArrayItem(Descriptions),
    userName: getRandomArrayItem(Peoples),
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
