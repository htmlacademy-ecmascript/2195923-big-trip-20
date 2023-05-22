import { getOffers } from '../mock/offer-mock.js';

export default class OffersModel {
  #offers = getOffers();

  get offers() {
    return this.#offers;
  }
}
