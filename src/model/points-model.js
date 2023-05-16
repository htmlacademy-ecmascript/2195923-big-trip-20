import { generatePoint, getDestinations, getOffers } from '../mock/mock.js';

const POINT_COUNT = 4;

export default class PointsModel {
  points = Array.from({length: POINT_COUNT}, generatePoint);
  destinations = getDestinations();
  offers = getOffers();

  getPoints() {
    return this.points;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }
}
