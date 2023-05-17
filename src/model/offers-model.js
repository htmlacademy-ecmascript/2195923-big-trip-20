import { getOffers } from '../mock/offer-mock.js';

export default class OffersModel {
  offers = getOffers();

  getOffers() {
    return this.offers;
  }
}
