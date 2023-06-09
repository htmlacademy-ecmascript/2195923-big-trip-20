import AbstractView from '../framework/view/abstract-view.js';
import {formatDate, formatDuration} from '../utils.js';
import {DateFormat} from '../const.js';
import {RenderPosition} from '../framework/render.js';

const createListOffersInTemplate = (checkedOffers) => {
  if (checkedOffers === undefined) {
    return;
  }
  const eventList = document.createElement('ul');
  eventList.classList.add('event__selected-offers');
  for (let i = 0; i < checkedOffers.length; i++) {
    const eventOffer =
      `<li class="event__offer">
        <span class="event__offer-title">${checkedOffers[i].title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${checkedOffers[i].price}</span>
      </li>`;

    eventList.insertAdjacentHTML(RenderPosition.BEFOREEND, eventOffer);
  }
  return eventList.outerHTML;
};

function createPointTemplate(point, destination, checkedOffers) {
  const { basePrice, dateFrom, dateTo, isFavorite, type } = point;
  const name = destination ? destination.name : '';

  const listOffers = createListOffersInTemplate(checkedOffers);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${formatDate(dateFrom, DateFormat.ONLY_DATE_MAIN)}">${formatDate(dateFrom, DateFormat.ONLY_DATE_SECONDARY)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${formatDate(dateFrom, DateFormat.DATETIME_ATTRIBUTE)}">${formatDate(dateFrom, DateFormat.ONLY_TIME)}</time>
            &mdash;
            <time class="event__end-time" datetime="${formatDate(dateTo, DateFormat.DATETIME_ATTRIBUTE)}">${formatDate(dateTo, DateFormat.ONLY_TIME)}</time>
          </p>
          <p class="event__duration">${formatDuration(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        ${listOffers}
        <button class="event__favorite-btn ${isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class PointView extends AbstractView {
  #point = null;
  #destination = null;
  #checkedOffers = null;
  #handleEditClick = null;
  #handleFavoriteClick = null;

  constructor({point, destination, checkedOffers, onEditClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#checkedOffers = checkedOffers;
    this.#handleEditClick = onEditClick;
    this.#handleFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point, this.#destination, this.#checkedOffers);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavoriteClick();
  };
}
