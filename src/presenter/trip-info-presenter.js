import TripInfoView from '../view/trip-info-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { UpdateType, UserAction } from '../const.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #tripInfoComponent = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  constructor(tripInfoContainer, models) {
    this.#tripInfoContainer = tripInfoContainer;

    const {pointsModel, destinationsModel, offersModel} = models;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get #points() {
    return this.#pointsModel.points;
  }

  get #tripStartDate() {
    return this.#pointsModel.tripStartDate;
  }

  get #tripEndDate() {
    return this.#pointsModel.tripEndDate;
  }

  get #totalPrice() {
    return this.#pointsModel.totalPrice;
  }

  get #destinationIds() {
    return this.#pointsModel.destinationIds;
  }

  get #routeOfTrip() {
    return this.#destinationsModel.getRouteOfTrip(this.#destinationIds);
  }

  init() {
    const totalPrice = this.#calculateTotalPrice(this.#totalPrice);

    this.#renderTripInfo({
      tripStartDate: this.#tripStartDate,
      tripEndDate: this.#tripEndDate,
      totalPrice: totalPrice,
      routeOfTrip: this.#routeOfTrip,
    });
  }

  #clearTripInfo() {
    remove(this.#tripInfoComponent);
  }

  #renderTripInfo(data) {
    this.#tripInfoComponent = new TripInfoView(data);
    render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
  }

  #calculateTotalPrice(pointsBasePrice) {
    let offersPrice = 0;
    for (const point of this.#points) {
      offersPrice += this.#getTotalPriceByTypeAndIds(point);
    }
    return pointsBasePrice + offersPrice;
  }

  #getTotalPriceByTypeAndIds(point) {
    return this.#offersModel.getTotalPriceByTypeAndIds(point.type, point.offers);
  }

  #handleModelEvent = (updateType, point) => {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)

        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearTripInfo();
        this.init();
        break;
    }
  };
}
