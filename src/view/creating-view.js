import flatpickr from 'flatpickr';
import he from 'he';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {DateFormat, RoutePointType, BLANK_POINT} from '../const.js';
import {formatDate} from '../utils.js';

import 'flatpickr/dist/flatpickr.min.css';

function createDescriptionOfPointInTemplate(description) {
  return `<p class="event__destination-description">${description}</p>`;
}

function createListOfPicturesInTemplate(pictures) {
  let list = '';
  for (const picture of pictures) {
    list += `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`;
  }
  return list;
}

function createRoutePointTypesInTemplate(type) {
  let list = '';
  for (const point of Object.values(RoutePointType)) {
    const pointWithFirstCapitalLetter = point[0].toUpperCase() + point.slice(1);
    list += `<div class="event__type-item">
      <input id="event-type-${point}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${point}" ${type === point ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${point}" for="event-type-${point}-1">${pointWithFirstCapitalLetter}</label>
    </div>`;
  }
  return list;
}

function createDestinationNamesInTemplate(destinationsName) {
  let list = '';
  for (const name of destinationsName) {
    list += `<option value="${name}"></option>`;
  }
  return list;
}

function createListOfOffersInTemplate(offersForType, checkedOffers, isDisabled) {
  let list = '';
  for (const offer of offersForType) {
    const lastWordOfTitle = offer.id.split(' ').pop();
    const isChecked = checkedOffers?.find((checkedOffer) => checkedOffer.id === offer.id);
    list +=
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${lastWordOfTitle}-1" type="checkbox" name="event-offer-${lastWordOfTitle}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
        <label class="event__offer-label" for="event-offer-${lastWordOfTitle}-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`;
  }
  return list;
}

function createSectionOfOffersInTemplate(offersForType, checkedOffers, isDisabled) {
  if (offersForType?.length) {
    return `
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${createListOfOffersInTemplate(offersForType, checkedOffers, isDisabled)}
        </div>
      </section>`;
  }
  return '';
}

function createSectionOfDestinationInTemplate (destination) {
  if (destination === undefined) {
    return '';
  }
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
}

function buttonNegativeText(isEdit, isDeleting) {
  if (isEdit && isDeleting) {
    return 'Deleting...';
  } else if (isEdit && !isDeleting) {
    return 'Delete';
  } else {
    return 'Cancel';
  }
}

function createPointTemplate(point, destinationsName) {
  const { basePrice, dateFrom, dateTo, offers, offersForType, type, destination, isDisabled, isSaving, isDeleting } = point;

  return `<li class="trip-events__item">
            <form class="event event--edit" action="#" method="post">
              <header class="event__header">
                <div class="event__type-wrapper">
                  <label class="event__type  event__type-btn" for="event-type-toggle-1">
                    <span class="visually-hidden">Choose event type</span>
                    <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                  </label>
                  <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
                  <div class="event__type-list">
                    <fieldset class="event__type-group">
                      <legend class="visually-hidden">Event type</legend>
                      ${createRoutePointTypesInTemplate(type)}
                    </fieldset>
                  </div>
                </div>

                <div class="event__field-group  event__field-group--destination">
                  <label class="event__label  event__type-output" for="event-destination-1">${type}</label>
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? he.encode(destination.name) : ''}" list="destination-list-1" ${isDisabled ? 'disabled' : ''} required>
                  <datalist id="destination-list-1">
                    ${createDestinationNamesInTemplate(destinationsName)}
                  </datalist>
                </div>

                <div class="event__field-group  event__field-group--time">
                  <label class="visually-hidden" for="event-start-time-1">From</label>
                  <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${formatDate(dateFrom, DateFormat.FULL_DATE)}" ${isDisabled ? 'disabled' : ''}>
                  &mdash;
                  <label class="visually-hidden" for="event-end-time-1">To</label>
                  <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${formatDate(dateTo, DateFormat.FULL_DATE)}" ${isDisabled ? 'disabled' : ''}>
                </div>

                <div class="event__field-group  event__field-group--price">
                  <label class="event__label" for="event-price-1">
                    <span class="visually-hidden">Price</span>
                    &euro;
                  </label>
                  <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${he.encode(basePrice.toString())}" ${isDisabled ? 'disabled' : ''}>
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
                <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${buttonNegativeText(false, isDeleting)}</button>
              </header>
              <section class="event__details">
                ${createSectionOfOffersInTemplate(offersForType, offers, isDisabled)}
                ${createSectionOfDestinationInTemplate(destination)}
              </section>
            </form>
          </li>`;
}

export default class CreatingView extends AbstractStatefulView {
  #allDestinations = null;
  #allOffers = null;
  #destinationsName = null;

  #handleCreateFormSubmit = null;
  #handleCreateFormCancel = null;

  #datepickerForStartDateAndTime = null;
  #datepickerForEndDateAndTime = null;

  constructor({
    allDestinations,
    destination,
    allOffers,
    offersForType,
    checkedOffers,
    point = BLANK_POINT,
    destinationsName,
    onCreateFormSubmit,
    onCreateFormCancel
  }) {
    super();
    this.#allDestinations = allDestinations;
    this.#allOffers = allOffers;
    this.#destinationsName = destinationsName;
    this.#handleCreateFormSubmit = onCreateFormSubmit;
    this.#handleCreateFormCancel = onCreateFormCancel;

    this._setState(CreatingView.parsePointToState({point, offersForType, checkedOffers, destination}));
    this._restoreHandlers();
  }

  get template() {
    return createPointTemplate(this._state, this.#destinationsName);
  }

  removeElement() {
    super.removeElement();

    if(this.#datepickerForStartDateAndTime) {
      this.#datepickerForStartDateAndTime.destroy();
      this.#datepickerForStartDateAndTime = null;
    }
    if(this.#datepickerForEndDateAndTime) {
      this.#datepickerForEndDateAndTime.destroy();
      this.#datepickerForEndDateAndTime = null;
    }
  }

  reset(point, offersForType, checkedOffers, destination) {
    this.updateElement(
      CreatingView.parsePointToState({point, offersForType, checkedOffers, destination})
    );
  }

  _restoreHandlers() {
    this.element.querySelector('.event__save-btn').addEventListener('click', this.#createFormSubmitHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#createFormCancelHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#pointDestinationChangeHandler);
    this.element.querySelector('.event__details').addEventListener('change',this.#pointOfferChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#pointPriceChangeHandler);

    this.#setDatepickers();
  }

  #setDatepickers() {
    this.#datepickerForStartDateAndTime = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        'time_24hr': true,
        maxDate: this._state.dateTo,
        onClose: this.#pointStartDateAndTimeChangeHandler,
      },
    );

    this.#datepickerForEndDateAndTime = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        'time_24hr': true,
        minDate: this._state.dateFrom,
        onClose: this.#pointEndDateAndTimeChangeHandler,
      },
    );
  }

  #createFormSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleCreateFormSubmit(CreatingView.parseStateToPoint(this._state));
  };

  #createFormCancelHandler = (evt) => {
    evt.preventDefault();
    this.#handleCreateFormCancel();
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
      offersForType: this.#allOffers.find((offer) => offer.type === evt.target.value).offers,
    });
  };

  #pointDestinationChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: this.#allDestinations.find((destination) => destination.name === evt.target.value),
    });
  };

  #pointOfferChangeHandler = (evt) => {
    evt.preventDefault();
    const checkedOfferName = evt.target.name.split('-').pop();
    const checkingOffer = this._state.offersForType.find((offer) => offer.id.split('-').pop() === checkedOfferName);
    if (evt.target.checked) {
      this.updateElement({
        offers: [...this._state.offers, checkingOffer],
      });
    } else {
      const cloneOffers = structuredClone(this._state.offers);
      const indexCheckingOffer = cloneOffers.findIndex((cloneOffer) => cloneOffer.id === checkingOffer.id);
      cloneOffers.splice(indexCheckingOffer, 1);
      this.updateElement({
        offers: [...cloneOffers],
      });
    }
  };

  #pointPriceChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      basePrice: evt.target.value,
    });
  };

  #pointStartDateAndTimeChangeHandler = ([userDateAndTime]) => {
    this.updateElement({
      dateFrom: userDateAndTime,
    });
  };

  #pointEndDateAndTimeChangeHandler = ([userDateAndTime]) => {
    this.updateElement({
      dateTo: userDateAndTime,
    });
  };

  static parsePointToState({point, offersForType, checkedOffers, destination}) {
    return {...point,
      offers: checkedOffers,
      offersForType,
      destination,
      isDisabled: false,
      isSaving: false,
      isDeleting: false};
  }

  static parseStateToPoint(state) {
    const point = {...state};

    point.basePrice = Number.parseInt(state.basePrice, 10);
    point.offers = state.offers?.map((offer) => offer.id);
    point.destination = state.destination?.id;
    delete point.offersForType;
    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
