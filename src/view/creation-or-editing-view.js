import { DateFormat, Mode } from '../const.js';
import { formatDate } from '../utils.js';
import { destinationNames, routePointTypes } from '../mock/const.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

const blankPoint = {
  basePrice: 0,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: destinationNames[0],
  id: 0,
  isFavorite: false,
  offers: [],
  type: routePointTypes[0],
};

const createDescriptionOfPointInTemplate = (description) => `<p class="event__destination-description">${description}</p>`;

const createListOfPicturesInTemplate = (pictures) => {
  let list = '';
  for (const picture of pictures) {
    list += `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
  }
  return list;
};

const createRoutePointTypesInTemplate = (type) => {
  let list = '';
  for (const point of routePointTypes) {
    const pointWithFirstCapitalLetter = point[0].toUpperCase() + point.slice(1);
    list += `<div class="event__type-item">
      <input id="event-type-${point}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${point}" ${type === point ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${point}" for="event-type-${point}-1">${pointWithFirstCapitalLetter}</label>
    </div>`;
  }
  return list;
};

const createDestinationNamesInTemplate = () => {
  let list = '';
  for (const name of destinationNames) {
    list += `<option value="${name}"></option>`;
  }
  return list;
};

const createListOfOffersInTemplate = (offersForType, checkedOffers) => {
  let list = '';
  for (const offer of offersForType) {
    const lastWordOfTitle = offer.title.split(' ').pop();
    const isChecked = checkedOffers?.find((checkedOffer) => checkedOffer === offer.id);
    list +=
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${lastWordOfTitle}-1" type="checkbox" name="event-offer-${lastWordOfTitle}" ${isChecked ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${lastWordOfTitle}-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`;
  }
  return list;
};

const createSectionOfOffersInTemplate = (offersForType, checkedOffers) => {
  if (offersForType.length !== 0) {
    return `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${createListOfOffersInTemplate(offersForType, checkedOffers)}
        </div>
      </section>`;
  }
  return '';
};

const createSectionOfDestinationInTemplate = (destination) => {
  const { description, pictures } = destination;
  if (description.length === 0 && pictures.length === 0) {
    return '';
  }
  return `
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${createDescriptionOfPointInTemplate(description)}
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${createListOfPicturesInTemplate(pictures)}
        </div>
      </div>
    </section>`;
};


function createEditPointTemplate(destination, point, mode) {
  const { basePrice, dateFrom, dateTo, offers, offersForType, type } = point;
  const { name } = destination;
  const isEdit = mode === Mode.EDIT;

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
                  <div class="event__type-list">
                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Event type</legend>
                      ${createRoutePointTypesInTemplate(type)}
                    </fieldset>
                  </div>
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">${type}</label>
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
                  <datalist id="destination-list-1">
                    ${createDestinationNamesInTemplate()}
                  </datalist>
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(dateFrom, DateFormat.FULL_DATE)}">
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-1">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(dateTo, DateFormat.FULL_DATE)}">
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${basePrice}">
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                <button class="event__reset-btn" type="reset">${isEdit ? 'Delete' : 'Cancel'}</button>
                ${isEdit ? `
                      <button class="event__rollup-btn" type = "button">
                        <span class="visually-hidden">Open event</span>
                      </button >` : ''}
              </header>
              <section class="event__details">
                ${createSectionOfOffersInTemplate(offersForType, offers)}
                ${createSectionOfDestinationInTemplate(destination)}
              </section>
            </form>
          </li>`;
}

export default class CreationOrEditingView extends AbstractStatefulView {
  #allDestinations = null;
  #destination = null;
  #allOffers = null;
  #offersForType = null;
  #mode = null;
  #point = null;
  #handleEditFormSubmit = null;
  #handleEditFormCancel = null;

  constructor({allDestinations, destination, allOffers, offersForType, point = blankPoint, mode = Mode.CREATE, onEditFormSubmit, onEditFormCancel}) {
    super();
    this.#allDestinations = allDestinations;
    this.#destination = destination;
    this.#allOffers = allOffers;
    this.#offersForType = offersForType;
    this.#mode = mode;
    this._setState(CreationOrEditingView.parsePointToState(point, this.#offersForType));

    this.#handleEditFormSubmit = onEditFormSubmit;
    this.#handleEditFormCancel = onEditFormCancel;

    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.element.querySelector('.event--edit').addEventListener('submit', this.#editFormSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editFormCancelHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#pointDestinationHandler);
  }

  get template() {
    return createEditPointTemplate(this.#destination, this._state, this.#mode);
  }

  #editFormSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormSubmit(CreationOrEditingView.parseStateToPoint(this._state));
  };

  #editFormCancelHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormCancel();
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: null,
      offersForType: this.#allOffers.find((offer) => offer.type === evt.target.value).offers,
    });
  };

  #pointDestinationHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: this.#allDestinations.find((destination) => destination.name === evt.target.value).id,
    });
  };

  static parsePointToState(point, offersForType) {
    return {...point, offersForType: offersForType};
  }

  static parseStateToPoint(state) {
    return state;
  }

  reset(point, offersForType) {
    this.updateElement(
      CreationOrEditingView.parsePointToState(point, offersForType)
    );
  }
}
