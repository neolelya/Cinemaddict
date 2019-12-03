const FILTER_NAMES = [`all`, `watchlist`, `history`, `favorites`];

export const generateFilters = (films) => {
  const filters = {};
  for (const filterName of FILTER_NAMES) {
    filters[filterName] = {
      name: filterName,
      count: films.filter((film) => film[`is${filterName[0].toUpperCase()}${filterName.slice(1)}`]).length
    };
  }

  return filters;
};
