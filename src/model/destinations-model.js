import { getDestinations } from '../mock/destination-mock.js';

export default class DestinationsModel {
  destinations = getDestinations();

  getDestinations() {
    return this.destinations;
  }
}
