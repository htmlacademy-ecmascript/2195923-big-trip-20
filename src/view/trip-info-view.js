import { formatDate } from '../utils.js';
import { DateFormat, QUANTITY_OF_CITIES_IN_TRIP } from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const createDurationInTemplate = (points) => {
  const dateFrom = points[0].dateFrom;
  const dateTo = points[points.length - 1].dateTo;
  return `${formatDate(dateFrom, DateFormat.ONLY_DATE_TERTIARY)}&nbsp;&mdash;&nbsp;${formatDate(dateTo, DateFormat.ONLY_DATE_TERTIARY)}`;
};

const createRouteInTemplate = (points, destinations) => {
  const routeСities = [];
  const destination = destinations.find((destinationElement) => destinationElement.id === points[0].destination);
  routeСities.push(destination.name);
  for (let i = 1; i < points.length; i++) {
    if (destinations.find((destinationElement) => destinationElement.id === points[i].destination).name !== destinations.find((destinationElement) => destinationElement.id === points[i - 1].destination).name) {
      routeСities.push(destinations.find((destinationElement) => destinationElement.id === points[i].destination).name);
    }
  }

  let route = `${routeСities[0]}`;
  if (routeСities.length <= QUANTITY_OF_CITIES_IN_TRIP) {
    for (let i = 1; i < routeСities.length; i++) {
      route += ` &mdash; ${routeСities[i]}`;
    }
  } else {
    route += ` &mdash; ... &mdash; ${routeСities[routeСities.length - 1]}`;
  }

  return route;
};

const calculatePriceOfRoute = (points, offers) => {
  let priceRoute = 0;
  for (const point of points) {
    const pointOffersId = new Set(point.offers);
    priceRoute += point.basePrice;
    const offerForType = offers.find((offer) => offer.type === point.type);
    for (const offer of offerForType.offers) {
      if (pointOffersId.has(offer.id)) {
        priceRoute += offer.price;
      }
    }
  }

  return priceRoute;
};

function createTripInfoTemplate(points, destinations, offers) {
  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${createRouteInTemplate(points, destinations)}</h1>

        <p class="trip-info__dates">${createDurationInTemplate(points)}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${calculatePriceOfRoute(points, offers)}</span>
      </p>
    </section>`
  );
}

export default class TripInfoView extends AbstractView {
  #points = null;
  #destinations = null;
  #offers = null;

  constructor({points, destinations, offers}) {
    super();
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  get template() {
    return createTripInfoTemplate(this.#points, this.#destinations, this.#offers);
  }
}
