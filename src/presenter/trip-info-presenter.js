import TripInfoView from '../view/trip-info-view.js';
import NewPointButtonView from '../view/new-point-button-view.js';
import CreationOrEditingView from '../view/creation-or-editing-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import { UpdateType, UserAction, Mode } from '../const.js';
import { destinationNames, routePointTypes } from '../mock/const.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #tripInfoComponent = null;
  #newPointButtonComponent = null;
  #pointCreateComponent = null;
  #newPointCreateContainer = null;

  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  constructor(tripInfoContainer, newPointCreateContainer, models) {
    this.#tripInfoContainer = tripInfoContainer;
    this.#newPointCreateContainer = newPointCreateContainer;

    const {pointsModel, destinationsModel, offersModel} = models;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get #points() {
    return this.#pointsModel.points;
  }

  get #destinations() {
    return this.#destinationsModel.destinations;
  }

  get #offers() {
    return this.#offersModel.offers;
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
    this.#newPointButtonComponent = new NewPointButtonView({onNewPointButtonClick: this.#handleNewPointButtonClick});
    render(this.#tripInfoComponent, this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
    render(this.#newPointButtonComponent, this.#tripInfoContainer, RenderPosition.BEFOREEND);
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

  #getOffersForType() {
    return this.#offers.find((offer) => offer.type === routePointTypes[0]).offers;
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

  #handleNewPointButtonClick = (evt) => {
    this.#pointCreateComponent = new CreationOrEditingView({
      allDestinations: this.#destinations,
      allOffers: this.#offers,
      offersForType: this.#getOffersForType(),
      checkedOffers: [],
      mode: Mode.CREATE,
      onCreateOrEditFormSubmit: this.#handleCreateFormSubmit,
      onCreateOrEditFormCancel: this.#handleCreateFormCancel,
    });
    render(this.#pointCreateComponent, this.#newPointCreateContainer.element, RenderPosition.AFTERBEGIN);
  };

  #handleCreateFormSubmit = () => {

  };

  #handleCreateFormCancel = () => {

  };
}
