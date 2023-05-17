import { nanoid } from 'nanoid';
import { getRandomInteger, generateDate } from './util.js';
import { RoutePointTypes } from './const.js';
import { getRandomDestinationId } from './destination-mock.js';
import { getOffersId } from './offer-mock.js';

const generateRoutePointType = () => RoutePointTypes[getRandomInteger(0, RoutePointTypes.length - 1)];

const getPoint = () => {
  const routePointType = generateRoutePointType();
  const dateFirst = generateDate();
  const dateSecond = generateDate();

  return {
    basePrice: getRandomInteger(100, 200),
    dateFrom: dateFirst.diff(dateSecond) < 0 ? dateFirst : dateSecond,
    dateTo: dateFirst.diff(dateSecond) >= 0 ? dateFirst : dateSecond,
    destination: getRandomDestinationId(),
    id: nanoid(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: getOffersId(routePointType),
    type: routePointType,
  };
};

export { getPoint };
