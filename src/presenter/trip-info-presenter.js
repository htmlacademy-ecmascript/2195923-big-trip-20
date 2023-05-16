import TripInfoView from '../view/trip-info-view.js';
import { render, RenderPosition } from '../render.js';

export default class TripInfoPresenter {

  constructor(tripInfoContainer, pointsModel) {
    this.tripInfoContainer = tripInfoContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.routePoints = [...this.pointsModel.getPoints()];
    this.destinations = [...this.pointsModel.getDestinations()];
    this.offers = [...this.pointsModel.getOffers()];

    const tripMainElement = document.querySelector('.trip-main');
    render(new TripInfoView(this.routePoints, this.destinations, this.offers), tripMainElement, RenderPosition.AFTERBEGIN);
  }
}
