import AbstractView from '../framework/view/abstract-view.js';
import {formatDate} from '../utils.js';
import {DateFormat} from '../const.js';

function createRouteInTemplate(routeOfTrip) {
  return routeOfTrip.reduce((route, pointOfRoute) => `${route } &mdash; ${ (pointOfRoute === undefined) ? '...' : pointOfRoute}`);
}

function createTripInfoTemplate(tripStartDate, tripEndDate, totalPrice, routeOfTrip) {
  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${createRouteInTemplate(routeOfTrip)}</h1>

        <p class="trip-info__dates">
          ${formatDate(tripStartDate, DateFormat.ONLY_DATE_TERTIARY)}&nbsp;&mdash;&nbsp;${formatDate(tripEndDate, DateFormat.ONLY_DATE_TERTIARY)}
        </p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
      </p>
    </section>`
  );
}

export default class TripInfoView extends AbstractView {
  #tripStartDate = null;
  #tripEndDate = null;
  #totalPrice = null;
  #routeOfTrip = null;

  constructor({tripStartDate, tripEndDate, totalPrice, routeOfTrip}) {
    super();
    this.#tripStartDate = tripStartDate;
    this.#tripEndDate = tripEndDate;
    this.#totalPrice = totalPrice;
    this.#routeOfTrip = routeOfTrip;
  }

  get template() {
    return createTripInfoTemplate(this.#tripStartDate, this.#tripEndDate, this.#totalPrice, this.#routeOfTrip);
  }
}
