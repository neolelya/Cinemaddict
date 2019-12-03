export const createMenuFiltersTemplate = (data) => {
  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">${data.watchlist.name[0].toUpperCase()}${data.watchlist.name.slice(1)} <span class="main-navigation__item-count">${data.watchlist.count}</span></a>
      <a href="#history" class="main-navigation__item">${data.history.name[0].toUpperCase()}${data.history.name.slice(1)} <span class="main-navigation__item-count">${data.history.count}</span></a>
      <a href="#favorites" class="main-navigation__item">${data.favorites.name[0].toUpperCase()}${data.favorites.name.slice(1)} <span class="main-navigation__item-count">${data.favorites.count}</span></a>
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>
      
    <ul class="sort">
      <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" class="sort__button">Sort by date</a></li>
      <li><a href="#" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};
