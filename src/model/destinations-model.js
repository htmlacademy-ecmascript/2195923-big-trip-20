import { getDestinations } from '../mock/destination-mock.js';

export default class DestinationsModel {
  #destinations = getDestinations();

  get destinations() {
    return this.#destinations;
  }

  getRouteOfTrip(destinationIds) {
    const routeСities = [];
    const numberOfCities = destinationIds.length;
    switch(numberOfCities.toString()){
      case '1':
        routeСities.push(this.#getNamePoint(destinationIds[0]));
        break;
      case '2':
        routeСities.push(this.#getNamePoint(destinationIds[0]));
        routeСities.push(this.#getNamePoint(destinationIds[1]));
        break;
      case '3':
        routeСities.push(this.#getNamePoint(destinationIds[0]));
        routeСities.push(this.#getNamePoint(destinationIds[1]));
        routeСities.push(this.#getNamePoint(destinationIds[2]));
        break;
      default:
        routeСities.push(this.#getNamePoint(destinationIds[0]));
        routeСities.push(this.#getNamePoint(''));
        routeСities.push(this.#getNamePoint(destinationIds[destinationIds.length - 1]));
    }
    return routeСities;
  }

  #getNamePoint(idDestination) {
    return this.#destinations.find((destination) => destination.id === idDestination)?.name;
  }
}

