import TripInfoView from '../view/trip-info-view.js';
import { render, RenderPosition } from '../framework/render.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #routePoints = [];

  constructor(tripInfoContainer, models) {
    this.#tripInfoContainer = tripInfoContainer;

    const {pointsModel, destinationsModel, offersModel} = models;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#routePoints = [...this.#pointsModel.points];
    const tripStartDate = this.#pointsModel.tripStartDate;
    const tripEndDate = this.#pointsModel.tripEndDate;

    const totalPrice = this.#calculateTotalPrice(this.#pointsModel.totalPrice);
    const routeOfTrip = this.#destinationsModel.getRouteOfTrip(this.#pointsModel.destinationIds);

    this.#renderTripInfo({
      tripStartDate: tripStartDate,
      tripEndDate: tripEndDate,
      totalPrice: totalPrice,
      routeOfTrip: routeOfTrip,
    });
  }

  #renderTripInfo(data) {
    const tripInfoComponent = new TripInfoView(data);
    render(tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
  }

  #calculateTotalPrice(pointsBasePrice) {
    let offersPrice = 0;
    for (const point of this.#routePoints) {
      offersPrice += this.#offersModel.getTotalPriceByTypeAndIds(point.type, point.offers);
    }
    return pointsBasePrice + offersPrice;
  }
}
