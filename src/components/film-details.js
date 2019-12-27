import {formatDate, formatTime, formatCommentDate, getRandomArrayItem} from '../utils/utils';
import AbstractComponent from './abstract-component';
import {PEOPLES} from '../mock/film';

const createGenreTemplate = (genres) => {
  return Array.from(genres).map((genre) => `<span class="film-details__genre">${genre}</span>`).join(``);
};

const createCommentsTemplate = (comments) => {
  return Array.from(comments)
    .map((comment) => (`<li class="film-details__comment">
                            <span class="film-details__comment-emoji">
                                <img src="${comment.emoji}" width="55" height="55" alt="emoji">
                            </span>
                            <div>
                                <p class="film-details__comment-text">${comment.comment.replace(/</g, `&lt`)}</p>
                                <p class="film-details__comment-info">
                                    <span class="film-details__comment-author">${comment.userName}</span>
                                    <span class="film-details__comment-day">${formatCommentDate(comment.date)}</span>
                                    <button class="film-details__comment-delete">Delete</button>
                                </p>
                            </div>
                        </li>`))
    .join(``);
};

const createFilmDetailsTemplate = (film, options = {}) => {
  const {
    comments,
    filmInfo: {
      title,
      alternativeTitle,
      totalRating,
      poster,
      ageRating,
      director,
      writer,
      actors,
      release: {
        date,
        releaseCountry
      },
      runtime,
      genres,
      description,
    }} = film;
  const {isWatchlist, isHistory, isFavorites} = options;

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">
              <p class="film-details__age">${ageRating}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${totalRating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writer}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${formatDate(date)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${formatTime(runtime)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${releaseCountry}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genre${genres.size > 1 ? `s` : ``}</td>
                  <td class="film-details__cell">
                    ${createGenreTemplate(genres)}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">${description}</p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isWatchlist ? `checked` : ``}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isHistory ? `checked` : ``}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorites ? `checked` : ``}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        ${isHistory ?
      `<div class="form-details__middle-container">
            <section class="film-details__user-rating-wrap">
                <div class="film-details__user-rating-controls">
                    <button class="film-details__watched-reset" type="button">Undo</button>
                </div>
    
                <div class="film-details__user-score">
                    <div class="film-details__user-rating-poster">
                        <img src="${poster}" alt="film-poster" class="film-details__user-rating-img">
                    </div>
    
                    <section class="film-details__user-rating-inner">
                        <h3 class="film-details__user-rating-title">${title}</h3>
    
                        <p class="film-details__user-rating-feelings">How you feel it?</p>
    
                        <div class="film-details__user-rating-score">
                            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="1" id="rating-1">
                            <label class="film-details__user-rating-label" for="rating-1">1</label>
    
                            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="2" id="rating-2">
                            <label class="film-details__user-rating-label" for="rating-2">2</label>
                  
                            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="3" id="rating-3">
                            <label class="film-details__user-rating-label" for="rating-3">3</label>
                  
                            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="4" id="rating-4">
                            <label class="film-details__user-rating-label" for="rating-4">4</label>
                  
                            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="5" id="rating-5">
                            <label class="film-details__user-rating-label" for="rating-5">5</label>
                  
                            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="6" id="rating-6">
                            <label class="film-details__user-rating-label" for="rating-6">6</label>
                  
                            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="7" id="rating-7">
                            <label class="film-details__user-rating-label" for="rating-7">7</label>
                  
                            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="8" id="rating-8">
                            <label class="film-details__user-rating-label" for="rating-8">8</label>
                  
                            <input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="9" id="rating-9" checked>
                            <label class="film-details__user-rating-label" for="rating-9">9</label>
    
                        </div>
                    </section>
                </div>
            </section>
         </div>`
      : ``}
        
        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count"></span></h3>

            <ul class="film-details__comments-list">
              ${createCommentsTemplate(comments)}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>
    
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>
    
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="grinning">
                <label class="film-details__emoji-label" for="emoji-gpuke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>
    
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="grinning">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetails extends AbstractComponent {
  constructor(film) {
    super();

    this._film = film;
    this._isWatchlist = !!film.isWatchlist;
    this._isHistory = !!film.isHistory;
    this._isFavorites = !!film.isFavorites;
    this._setEmojiHandler();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film, {
      isWatchlist: this._isWatchlist,
      isHistory: this._isHistory,
      isFavorites: this._isFavorites
    });
  }

  setClosePopupClickHandler(handler) {
    this.getElement()
      .querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);
  }

  setWatchlistClickHandler(handler) {
    this.getElement()
      .querySelector(`#watchlist`)
      .addEventListener(`click`, handler);
  }

  setAlreadyWatchedClickHandler(handler) {
    this.getElement()
      .querySelector(`#watched`)
      .addEventListener(`click`, handler);
  }

  setFavoriteClickHandler(handler) {
    this.getElement()
      .querySelector(`#favorite`)
      .addEventListener(`click`, handler);
  }

  disableAnimation() {
    this.getElement().style.animation = `none`;
  }

  enableAnimation() {
    this.getElement().removeAttribute(`style`);
  }

  setDeleteCommentHandler(handler) {
    this.getElement()
      .querySelector(`.film-details__comments-list`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName !== `BUTTON`) {
          return;
        }

        evt.preventDefault();
        const listItem = evt.target.closest(`li`);
        const index = Array.from(listItem.parentElement.children).indexOf(listItem);

        handler(index);
      });
  }

  _setEmojiHandler() {
    const regExp = /^https?:\/\/[^/]+/;
    const emojies = this.getElement().querySelectorAll(`.film-details__emoji-label`);
    emojies.forEach((element) => element.addEventListener(`click`, (evt) => {
      this.getElement()
        .querySelector(`.film-details__add-emoji-label`)
        .innerHTML = evt.target.outerHTML;
      this._selectedEmoji = evt.target.src.replace(regExp, ``);
    }));
  }

  setCommentHandler(handler) {
    const commentInput = this.getElement().querySelector(`.film-details__comment-input`);

    commentInput.addEventListener(`keydown`, (evt) => {
      const ctrlKeyPressed = evt.ctrlKey;
      const isEnterKey = evt.key === `Enter`;

      if (ctrlKeyPressed && isEnterKey && this._selectedEmoji) {
        const newComment = {
          emoji: this._selectedEmoji,
          comment: commentInput.value,
          userName: getRandomArrayItem(PEOPLES),
          date: new Date()
        };
        handler(newComment);
      }
    });
  }
}
