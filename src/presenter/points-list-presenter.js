import PointsListView from '../view/points-list-view.js';
import PointView from '../view/point-view.js';
import CreationOrEditingView from '../view/creation-or-editing-view.js';
import { render } from '../render.js';
import { Mode } from '../const.js';

export default class PointsListPresenter {
  pointsListComponent = new PointsListView();

  constructor(pointsListContainer, models) {
    this.pointsListContainer = pointsListContainer;

    const {pointsModel, destinationsModel, offersModel} = models;
    this.pointsModel = pointsModel;
    this.destinationsModel = destinationsModel;
    this.offersModel = offersModel;
  }

  init() {
    this.routePoints = [...this.pointsModel.getPoints()];
    this.destinations = [...this.destinationsModel.getDestinations()];
    this.offers = [...this.offersModel.getOffers()];

    render(this.pointsListComponent, this.pointsListContainer);

    let destination = this.destinations.find((destinationElement) => destinationElement.id === this.routePoints[0].destination);
    let offersForType = this.offers.find((offer) => offer.type === this.routePoints[0].type);
    render(new CreationOrEditingView(destination, offersForType, this.routePoints[0], Mode.EDIT), this.pointsListComponent.getElement());

    for (let i = 1; i < this.routePoints.length; i++) {
      destination = this.destinations.find((destinationElement) => destinationElement.id === this.routePoints[i].destination);
      offersForType = this.offers.find((offer) => offer.type === this.routePoints[i].type);

      const checkedOffers = [];
      this.routePoints[i].offers.forEach((routePointsOfferId) => {
        checkedOffers.push(offersForType.offers.find((offerElement) => offerElement.id === routePointsOfferId));
      });
      render(new PointView({point: this.routePoints[i], destination: destination, offers: checkedOffers}), this.pointsListComponent.getElement());
    }
  }
}
