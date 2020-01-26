import {formatDate, formatTime, formatCommentDate, commentEmotions} from '../utils/utils';
import AbstractComponent from './abstract-component';
import he from 'he';
import pluralize from 'pluralize';

const SHAKE_TIMEOUT = 600;
const MAX_USER_RATING_SCORE = 9;
const ERROR_COLOR = `red`;

const createGenreTemplate = (genres) => {
  return Array.from(genres).map((genre) => `<span class="film-details__genre">${genre}</span>`).join(``);
};

const createCommentsTemplate = (comments) => {
  return Array.from(comments)
    .map((comment) => (`<li class="film-details__comment">
                            <span class="film-details__comment-emoji">
                                <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji">
                            </span>
                            <div>
                                <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
                                <p class="film-details__comment-info">
                                    <span class="film-details__comment-author">${comment.author}</span>
                                    <span class="film-details__comment-day">${formatCommentDate(comment.date)}</span>
                                    <button class="film-details__comment-delete">Delete</button>
                                </p>
                            </div>
                        </li>`))
    .join(``);
};

const createEmotionListTemplate = (emotions) => {
  return Array.from(emotions)
    .map((emotion) =>
      (`<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emotion}" value="${emotion}">
        <label class="film-details__emoji-label" for="emoji-${emotion}">
          <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
        </label>`))
    .join(``);
};

const createUserRatingTemplate = (poster, title, personalRating) => {
  return (
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
                ${new Array(MAX_USER_RATING_SCORE)
                  .fill(null)
                  .map((_, index) => (
                    `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${index + 1}" id="rating-${index + 1}" ${personalRating === index + 1 ? `checked` : ``}>
                    <label class="film-details__user-rating-label" for="rating-${index + 1}">${index + 1}</label>`
                  ))
                  .join(``)}
              </div>
            </section>
          </div>
        </section>
      </div>`
  );
};

const createFilmDetailsTemplate = (film, comments) => {
  const {
    title,
    alternativeTitle,
    totalRating,
    poster,
    ageRating,
    director,
    writers,
    actors,
    releaseDate,
    releaseCountry,
    runtime,
    genre,
    description,
    isWatchlist,
    isHistory,
    personalRating,
    isFavorites
  } = film;

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
                  ${(isHistory && personalRating) ?
      `<p class="film-details__user-rating">Your rate ${personalRating}</p>`
      : ``
    }
                </div>
              </div>

              <table class="film-details__table">

              ${director ?
      `<tr class="film-details__row">
        <td class="film-details__term">Director</td>
        <td class="film-details__cell">${director}</td>
      </tr>`
      : ``
    }
              ${writers.length > 0 ?
      `<tr class="film-details__row">
        <td class="film-details__term">Writers</td>
        <td class="film-details__cell">${[...writers].join(`, `)}</td>
      </tr>`
      : ``
    }
              ${actors.length > 0 ?
      `<tr class="film-details__row">
        <td class="film-details__term">Actors</td>
        <td class="film-details__cell">${[...actors].join(`, `)}</td>
      </tr>`
      : ``
    }
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${formatDate(releaseDate)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${formatTime(runtime)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${releaseCountry}</td>
                </tr>

                ${genre.size > 0 ?
      `<tr class="film-details__row">
        <td class="film-details__term">${pluralize(`Genre`, genre.size)}</td>
        <td class="film-details__cell">
          ${createGenreTemplate(genre)}
        </td>
      </tr>`
      : ``
    }
              </table>

              <p class="film-details__film-description">${description.slice(0, 1).toUpperCase()}${description.slice(1)}</p>
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

        ${isHistory ? createUserRatingTemplate(poster, title, personalRating) : ``}

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${createCommentsTemplate(comments)}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                ${createEmotionListTemplate(commentEmotions)}
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetails extends AbstractComponent {
  constructor(film, comments) {
    super();

    this._film = film;
    this._comments = comments;

    this._setEmojiHandler();
    this._setRatingButtonClickHandler();
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._film, this._comments);
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
    const commentsList = this.getElement().querySelector(`.film-details__comments-list`);
    const deleteButton = this.getElement().querySelector(`.film-details__comment-delete`);

    commentsList.addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `BUTTON`) {
        return;
      }

      evt.preventDefault();
      const listItem = evt.target.closest(`li`);
      const index = Array.from(listItem.parentElement.children).indexOf(listItem);

      deleteButton.textContent = `Deleting…`;
      deleteButton.disables = true;

      handler(this._comments[index].id);
    });
  }

  setCommentHandler(handler) {
    const commentInput = this.getElement().querySelector(`.film-details__comment-input`);

    commentInput.addEventListener(`keydown`, (evt) => {
      const ctrlKeyPressed = evt.ctrlKey;
      const isEnterKey = evt.key === `Enter`;

      if (ctrlKeyPressed && isEnterKey && this._selectedEmotion) {
        const newComment = {
          emotion: this._selectedEmotion,
          comment: commentInput.value,
          date: new Date()
        };
        commentInput.disabled = true;
        handler(newComment);
      }
    });
  }

  errorCommentSubmitHandler() {
    const commentForm = this.getElement().querySelector(`.film-details__new-comment`);
    const commentInput = this.getElement().querySelector(`.film-details__comment-input`);
    const uncheckedEmotionInputs = this.getElement().querySelectorAll(`input[name="comment-emoji"]:not(:checked)`);

    commentForm.style.animation = `shake ${SHAKE_TIMEOUT / 1000}s`;
    commentInput.readOnly = true;
    commentInput.style.border = `3px solid ${ERROR_COLOR}`;
    uncheckedEmotionInputs.forEach((input) => (input.disabled = true));

    setTimeout(() => {
      commentForm.style.animation = ``;
      commentInput.readOnly = false;
      commentInput.style.border = ``;
      uncheckedEmotionInputs.forEach((input) => (input.disabled = false));
    }, SHAKE_TIMEOUT);
  }

  setRatingHandler(handler) {
    this.getElement().querySelectorAll(`.film-details__user-rating-input`)
      .forEach((input) => input.addEventListener(`change`, handler));
  }

  setResetRatingHandler(handler) {
    const resetRatingButton = this.getElement().querySelector(`.film-details__watched-reset`);

    if (resetRatingButton) {
      resetRatingButton.addEventListener(`click`, handler);
    }
  }

  errorRatingSubmitHandler() {
    const ratingForm = this.getElement().querySelector(`.film-details__user-rating-score`);
    const ratingInputs = this.getElement().querySelectorAll(`.film-details__user-rating-input`);
    const uncheckedRatingInputs = this.getElement().querySelectorAll(`input[name="score"]:not(:checked)`);

    ratingForm.style.animation = `shake ${SHAKE_TIMEOUT / 1000}s`;
    ratingInputs.forEach((input) => (input.disabled = true));
    uncheckedRatingInputs.forEach((input) => (input.labels[0].style.backgroundColor = ERROR_COLOR));

    setTimeout(() => {
      ratingForm.style.animation = ``;
      ratingInputs.forEach((input) => (input.disabled = false));
      uncheckedRatingInputs.forEach((input) => (input.labels[0].style.backgroundColor = ``));
    }, SHAKE_TIMEOUT);
  }

  _setRatingButtonClickHandler() {
    this.getElement().querySelectorAll(`.film-details__user-rating-input`)
      .forEach((inputItem) => inputItem.addEventListener(`click`, () => {
        this._film.personalRating = inputItem.value;
      }));
  }

  _setEmojiHandler() {
    const emotionsList = this.getElement().querySelector(`.film-details__emoji-list`);
    emotionsList.addEventListener(`change`, (evt) => {
      this._selectedEmotion = evt.target.value;
      this.getElement()
        .querySelector(`.film-details__add-emoji-label`)
        .innerHTML = `<img src="./images/emoji/${this._selectedEmotion}.png" width="30" height="30" alt="emoji">`;
    });
  }
}
