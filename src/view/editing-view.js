import { DateFormat, Mode, routePointTypes } from '../const.js';
import { formatDate } from '../utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

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

const createDestinationNamesInTemplate = (destinationsName) => {
  let list = '';
  for (const name of destinationsName) {
    list += `<option value="${name}"></option>`;
  }
  return list;
};

const createListOfOffersInTemplate = (offersForType, checkedOffers, isDisabled) => {
  let list = '';
  for (const offer of offersForType) {
    const lastSectionOfferId = offer.id.split('-').pop();
    const isChecked = checkedOffers?.find((checkedOffer) => checkedOffer.id === offer.id);
    list +=
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${lastSectionOfferId}-1" type="checkbox" name="event-offer-${lastSectionOfferId}" ${isChecked ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
        <label class="event__offer-label" for="event-offer-${lastSectionOfferId}-1">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`;
  }
  return list;
};

const createSectionOfOffersInTemplate = (offersForType, checkedOffers, isDisabled) => {
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
};

const createSectionOfDestinationInTemplate = (destination) => {
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
};

function buttonNegativeText(isEdit, isDeleting) {
  if (isEdit && isDeleting) {
    return 'Deleting...';
  } else if (isEdit && !isDeleting) {
    return 'Delete';
  } else {
    return 'Cancel';
  }
}

function editPointTemplate(point, destinationsName) {
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
                  <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? destination.name : ''}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
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
                  <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
                </div>

                <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
                <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${buttonNegativeText(true, isDeleting)}</button>
                <button class="event__rollup-btn" type = "button" ${isDisabled ? 'disabled' : ''}>
                  <span class="visually-hidden">Open event</span>
                </button >
              </header>
              <section class="event__details">
                ${createSectionOfOffersInTemplate(offersForType, offers, isDisabled)}
                ${createSectionOfDestinationInTemplate(destination)}
              </section>
            </form>
          </li>`;
}

export default class EditingView extends AbstractStatefulView {
  #allDestinations = null;
  #allOffers = null;
  #destinationsName = null;

  #handleEditFormSubmit = null;
  #handleEditFormDelete = null;
  #handleEditFormCancel = null;

  #datepickerForStartDateAndTime = null;
  #datepickerForEndDateAndTime = null;

  constructor({
    allDestinations,
    destination,
    allOffers,
    offersForType,
    checkedOffers,
    point,
    destinationsName,
    onEditFormSubmit,
    onEditFormDelete,
    onEditFormCancel
  }) {
    super();
    this.#allDestinations = allDestinations;
    this.#allOffers = allOffers;
    this.#destinationsName = destinationsName;
    this._setState(EditingView.parsePointToState({point, offersForType, checkedOffers, destination}));

    this.#handleEditFormSubmit = onEditFormSubmit;
    this.#handleEditFormDelete = onEditFormDelete;
    this.#handleEditFormCancel = onEditFormCancel;

    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editFormCancelHandler); //закрытие формы по стрелке вверх
    this.element.querySelector('.event--edit').addEventListener('submit', this.#editFormSubmitHandler); // нажатие на кнопку Save при редактировании
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#editFormDeleteHandler); //удаление точки в форме редактирования
    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#pointDestinationChangeHandler);
    this.element.querySelector('.event__details').addEventListener('change',this.#pointOfferChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#pointPriceChangeHandler);

    this.#setDatepickers();
  }

  get template() {
    return editPointTemplate(this._state, this.#destinationsName);
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

  #editFormSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormSubmit(EditingView.parseStateToPoint(this._state), Mode.EDIT);
  };

  #editFormDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormDelete(EditingView.parseStateToPoint(this._state));
  };

  #editFormCancelHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditFormCancel();
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

  reset(point, offersForType, checkedOffers, destination) {
    this.updateElement(
      EditingView.parsePointToState({point, offersForType, checkedOffers, destination})
    );
  }
}
