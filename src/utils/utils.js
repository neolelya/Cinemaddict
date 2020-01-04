import moment from 'moment';

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
  return moment(date).format(`YYYY/MM/DD HH:MM`);
};
