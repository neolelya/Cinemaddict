export const createMenuTemplate = (data) => {
  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${data.watchlist.count}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${data.history.count}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${data.favorites.count}</span></a>
      <a href="#stats" class="main-navigation__item main-navigation__item--additional">Stats</a>
    </nav>
      
    <ul class="sort">
      <li><a href="#" class="sort__button sort__button--active"></a></li>
      <li><a href="#" class="sort__button"></a></li>
      <li><a href="#" class="sort__button"></a></li>
    </ul>`
  );
};
