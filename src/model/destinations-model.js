import { getDestinations } from '../mock/destination-mock.js';

export default class DestinationsModel {
  #destinations = getDestinations();

  get destinations() {
    return this.#destinations;
  }
}
