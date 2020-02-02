import moment from 'moment';

export const commentEmotions = new Set([`smile`, `sleeping`, `puke`, `angry`]);

export const formatTime = (time) => {
  const duration = moment.duration(time, `minutes`);

  return moment.utc(duration.asMilliseconds()).format(`h[h] mm[m]`);
};

export const formatYear = (date) => {
  return moment(date).format(`YYYY`);
};

export const formatDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const formatCommentDate = (date) => {
  let result = moment(date).format(`YYYY/MM/DD HH:MM`);

  switch (true) {
    case moment(date).isBetween(moment().subtract(59, `seconds`), moment()):
      result = `now`;
      break;
    case moment(date).isBetween(moment().subtract(3, `minutes`), moment()):
      result = `a minute ago`;
      break;
    case moment(date).isBetween(moment().subtract(59, `minutes`), moment()):
      result = `a few minutes ago`;
      break;
    case moment(date).isBetween(moment().subtract(2, `hours`), moment()):
      result = `an hour ago`;
      break;
    case moment(date).isBetween(moment().subtract(24, `hours`), moment()):
      result = `a few hours ago`;
      break;
    case moment(date).isBetween(moment().subtract(1, `days`), moment()):
      result = `a day ago`;
      break;
    case moment(date).isBetween(moment().subtract(2, `days`), moment()):
      result = `two days ago`;
      break;
    case moment(date).isBetween(moment().subtract(3, `days`), moment()):
      result = `three days ago`;
      break;
  }

  return result;
};
