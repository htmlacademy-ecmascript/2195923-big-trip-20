import TripInfoView from '../view/trip-info-view.js';
import { render, RenderPosition } from '../framework/render.js';

export default class TripInfoPresenter {
  #tripInfoContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #routePoints = [];
  #destinations = [];
  #offers = [];

  constructor(tripInfoContainer, models) {
    this.#tripInfoContainer = tripInfoContainer;

    const {pointsModel, destinationsModel, offersModel} = models;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#routePoints = [...this.#pointsModel.getPoints()];
    this.#destinations = [...this.#destinationsModel.getDestinations()];
    this.#offers = [...this.#offersModel.getOffers()];

    render(new TripInfoView(this.#routePoints, this.#destinations, this.#offers), this.#tripInfoContainer, RenderPosition.AFTERBEGIN);
  }
}
