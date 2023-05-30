import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import { getRandomInteger, generateDate } from './util.js';
import { routePointTypes } from './const.js';
import { getRandomDestinationId } from './destination-mock.js';
import { getOffersId } from './offer-mock.js';

const generateRoutePointType = () => routePointTypes[getRandomInteger(0, routePointTypes.length - 1)];

const getPoint = () => {
  const routePointType = generateRoutePointType();
  const dateFirst = generateDate();
  const dateSecond = generateDate();

  return {
    basePrice: getRandomInteger(100, 200),
    dateFrom: dayjs(dateFirst).diff(dayjs(dateSecond)) < 0 ? dateFirst : dateSecond,
    dateTo: dayjs(dateFirst).diff(dayjs(dateSecond)) >= 0 ? dateFirst : dateSecond,
    destination: getRandomDestinationId(),
    id: nanoid(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: getOffersId(routePointType),
    type: routePointType,
  };
};

export { getPoint };
