import { nanoid } from 'nanoid';
import { getRandomInteger } from './util.js';
import { RoutePointTypes } from './const.js';

const mockOffers = [];

const offers = [
  {
    id: nanoid(),
    title: 'Add luggage',
    price: getRandomInteger(0, 100),
  },
  {
    id: nanoid(),
    title: 'Switch to comfort',
    price: getRandomInteger(0, 100),
  },
  {
    id: nanoid(),
    title: 'Add meal',
    price: getRandomInteger(0, 100),
  },
  {
    id: nanoid(),
    title: 'Choose seats',
    price: getRandomInteger(0, 100),
  },
  {
    id: nanoid(),
    title: 'Travel by train',
    price: getRandomInteger(0, 100),
  },
];

const getOffersId = (type) => {
  const checkedOffersId = [];
  for (const offerObject of mockOffers) {
    if (offerObject.type === type) {
      offerObject.offers.forEach((offer) => {
        if (getRandomInteger(0, 1)) {
          checkedOffersId.push(offer.id);
        }
      });
    }
  }
  return checkedOffersId;
};

const getRandomOffers = () => {
  const randomOffers = [];
  for (let i = 0; i < offers.length; i++) {
    if (getRandomInteger()) {
      randomOffers.push(offers[i]);
    }
  }
  return randomOffers;
};

const generateOffers = () => {
  RoutePointTypes.forEach((routePointType) => {
    const offersObj = {
      type: routePointType,
      offers: getRandomOffers(),
    };
    mockOffers.push(offersObj);
  });
  return mockOffers;
};

const getOffers = () => mockOffers;

generateOffers();

export {getOffersId, getOffers};

