import TripInfoView from '../view/trip-info-view.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { UpdateType } from '../const.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #tripInfoComponent = null;
  #newPointButtonComponent = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #handlePointCreate = null;

  constructor(tripInfoContainer, models, onPointCreate) {
    this.#tripInfoContainer = tripInfoContainer;

    const {pointsModel, destinationsModel, offersModel} = models;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#handlePointCreate = onPointCreate;

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
    this.#renderNewPointButton();
    if (this.#points.length) {
      const totalPrice = this.#calculateTotalPrice(this.#totalPrice);

      this.#renderTripInfo({
        tripStartDate: this.#tripStartDate,
        tripEndDate: this.#tripEndDate,
        totalPrice: totalPrice,
        routeOfTrip: this.#routeOfTrip,
      });
    }
  }

  enableNewPoint = () => {
    this.#newPointButtonComponent.removeDisabledAttribute();
  };

  #clearTripInfo() {
    remove(this.#tripInfoComponent);
    remove(this.#newPointButtonComponent);
  }

  #renderNewPointButton() {
    this.#newPointButtonComponent = new NewPointButtonView({onNewPointButtonClick: this.#handleNewPointButtonClick});
    render(this.#newPointButtonComponent, this.#tripInfoContainer, RenderPosition.BEFOREEND);
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

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      case UpdateType.PATCH:
        break;
      case UpdateType.MINOR:
        break;
      case UpdateType.MAJOR:
        this.#clearTripInfo();
        this.init();
        break;
    }
  };

  #handleNewPointButtonClick = () => {
    this.#handlePointCreate();
  };
}
