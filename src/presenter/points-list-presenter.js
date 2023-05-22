import PointsListView from '../view/points-list-view.js';
import PointView from '../view/point-view.js';
import CreationOrEditingView from '../view/creation-or-editing-view.js';
import { render } from '../framework/render.js';
import { Mode } from '../const.js';

export default class PointsListPresenter {
  #pointsListComponent = new PointsListView();
  #pointsListContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #routePoints = [];
  #destinations = [];
  #offers = [];


  constructor(pointsListContainer, models) {
    this.#pointsListContainer = pointsListContainer;

    const {pointsModel, destinationsModel, offersModel} = models;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#routePoints = [...this.#pointsModel.getPoints()];
    this.#destinations = [...this.#destinationsModel.getDestinations()];
    this.#offers = [...this.#offersModel.getOffers()];

    render(this.#pointsListComponent, this.#pointsListContainer);

    let destination = this.#destinations.find((destinationElement) => destinationElement.id === this.#routePoints[0].destination);
    let offersForType = this.#offers.find((offer) => offer.type === this.#routePoints[0].type);
    render(new CreationOrEditingView(destination, offersForType, this.#routePoints[0], Mode.EDIT), this.#pointsListComponent.element);

    for (let i = 1; i < this.#routePoints.length; i++) {
      destination = this.#destinations.find((destinationElement) => destinationElement.id === this.#routePoints[i].destination);
      offersForType = this.#offers.find((offer) => offer.type === this.#routePoints[i].type);

      const checkedOffers = [];
      this.#routePoints[i].offers.forEach((routePointsOfferId) => {
        checkedOffers.push(offersForType.offers.find((offerElement) => offerElement.id === routePointsOfferId));
      });
      this.#renderPoint({point: this.#routePoints[i], destination: destination, offers: checkedOffers});
    }
  }

  #renderPoint(data) {
    const pointComponent = new PointView(data);
    render(pointComponent, this.#pointsListComponent.element);
  }
}
