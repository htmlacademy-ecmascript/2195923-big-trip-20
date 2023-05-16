import EventsListView from '../view/events-list-view.js';
import EventTripView from '../view/event-trip-view.js';
import CreationOrEditingView from '../view/creation-or-editing-view.js';
import { render } from '../render.js';
import { Mode } from '../const.js';

export default class EventsListPresenter {
  eventsListComponent = new EventsListView();

  constructor(eventsListContainer, pointsModel) {
    this.eventsListContainer = eventsListContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.routePoints = [...this.pointsModel.getPoints()];
    this.destinations = [...this.pointsModel.getDestinations()];
    this.offers = [...this.pointsModel.getOffers()];

    render(this.eventsListComponent, this.eventsListContainer);

    let destination = this.destinations.find((destinationElement) => destinationElement.id === this.routePoints[0].destination);
    let offersForType = this.offers.find((offer) => offer.type === this.routePoints[0].type);
    render(new CreationOrEditingView(destination, offersForType, this.routePoints[0], Mode.EDIT), this.eventsListComponent.getElement());

    for (let i = 1; i < this.routePoints.length; i++) {
      destination = this.destinations.find((destinationElement) => destinationElement.id === this.routePoints[i].destination);
      const checkedOffers = [];
      offersForType = this.offers.find((offer) => offer.type === this.routePoints[i].type);

      this.routePoints[i].offers.forEach((routePointsOfferId) => {
        checkedOffers.push(offersForType.offers.find((offerElement) => offerElement.id === routePointsOfferId));
      });
      render(new EventTripView({point: this.routePoints[i], destination: destination, offers: checkedOffers}), this.eventsListComponent.getElement());
    }
  }
}
