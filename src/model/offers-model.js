import { getOffers } from '../mock/offer-mock.js';

export default class OffersModel {
  #offers = getOffers();

  get offers() {
    return this.#offers;
  }

  getTotalPriceByTypeAndIds(type, ids) {
    let totalPriceOffers = 0;
    const offerIds = new Set(ids);
    const offersByType = this.#offers.find((offer) => offer.type === type);
    for (const offer of offersByType.offers) {
      if (offerIds.has(offer.id)) {
        totalPriceOffers += offer.price;
      }
    }
    return totalPriceOffers;
  }
}
