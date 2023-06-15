import Observable from '../framework/observable.js';

export default class OffersModel extends Observable {
  #offersApiService = null;
  #offers = [];

  constructor({offersApiService}) {
    super();
    this.#offersApiService = offersApiService;
  }

  async init() {
    this.#offers = await this.#offersApiService.offers;
    return this.#offers;
  }

  get offers() {
    return this.#offers;
  }

  getTotalPriceByTypeAndIds(type, ids) {
    let totalPriceOffers = 0;
    const offerIds = new Set(ids);
    const offersByType = this.#offers.find((offer) => offer.type === type);
    if (offersByType === undefined) {
      return totalPriceOffers;
    }
    for (const offer of offersByType.offers) {
      if (offerIds.has(offer.id)) {
        totalPriceOffers += offer.price;
      }
    }
    return totalPriceOffers;
  }
}
