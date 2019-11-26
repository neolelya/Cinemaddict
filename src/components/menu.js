export const createMenuTemplate = () => {
  return (
    `<nav class="main-navigation">
      <a href="#all" class="main-navigation__item main-navigation__item--active"></a>
      <a href="#watchlist" class="main-navigation__item"><span class="main-navigation__item-count"></span></a>
      <a href="#history" class="main-navigation__item"><span class="main-navigation__item-count"></span></a>
      <a href="#favorites" class="main-navigation__item"><span class="main-navigation__item-count"></span></a>
      <a href="#stats" class="main-navigation__item main-navigation__item--additional"></a>
    </nav>
      
    <ul class="sort">
      <li><a href="#" class="sort__button sort__button--active"></a></li>
      <li><a href="#" class="sort__button"></a></li>
      <li><a href="#" class="sort__button"></a></li>
    </ul>`
  );
};
