import TripInfoView from '../view/trip-info-view.js';
import { render, RenderPosition } from '../render.js';

export default class TripInfoPresenter {

  constructor(tripInfoContainer, models) {
    this.tripInfoContainer = tripInfoContainer;

    const {pointsModel, destinationsModel, offersModel} = models;
    this.pointsModel = pointsModel;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
  }

  init() {
    this.routePoints = [...this.pointsModel.getPoints()];
    this.destinations = [...this.destinationsModel.getDestinations()];
    this.offers = [...this.offersModel.getOffers()];

    const tripMainElement = document.querySelector('.trip-main');
    render(new TripInfoView(this.routePoints, this.destinations, this.offers), tripMainElement, RenderPosition.AFTERBEGIN);
  }
}
