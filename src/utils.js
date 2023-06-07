import dayjs from 'dayjs';
import he from 'he';
import duration from 'dayjs/plugin/duration';
import { Time, DateFormat } from './const.js';

dayjs.extend(duration);

const formatDate = (date, format) => date ? dayjs(date).format(format) : '';

const formatDuration = (dateFrom, dateTo) => {
  const durationInMinutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute');
  let dateFormat = '';
  let days = 0;
  let hours = 0;
  let minutes = 0;
  if (durationInMinutes < Time.MINUTES_PER_HOUR) {
    dateFormat = DateFormat.ONLY_MINUTES_WITH_DESCRIPTION;
    minutes = durationInMinutes;
  } else if (durationInMinutes < Time.MINUTES_PER_DAY) {
    dateFormat = DateFormat.ONLY_TIME_WITH_DESCRIPTION;
    hours = Math.floor(durationInMinutes / Time.MINUTES_PER_HOUR);
    minutes = durationInMinutes % Time.MINUTES_PER_HOUR;
  } else {
    dateFormat = DateFormat.FULL_DURATION;
    days = Math.floor(durationInMinutes / Time.MINUTES_PER_DAY);
    hours = Math.floor(durationInMinutes / Time.MINUTES_PER_HOUR) - days * Time.HOURS_PER_DAY;
    minutes = durationInMinutes - days * Time.MINUTES_PER_DAY - hours * Time.MINUTES_PER_HOUR;
  }
  return dayjs.duration({ minutes, hours, days }).format(dateFormat);
};

const encodePointToCreateOrEditForm = (point) => {
  point.type = he.encode(point.type.toString());
  point.basePrice = he.encode(point.basePrice.toString());
  point.dateFrom = he.encode(point.dateFrom.toString());
  point.dateTo = he.encode(point.dateTo.toString());
  point.isFavorite = he.encode(point.isFavorite.toString());
  point.destination.description = he.encode(point.destination.description.toString());
  point.destination.name = he.encode(point.destination.name.toString());

  for (const picture of point.destination.pictures) {
    picture.description = he.encode(picture.description.toString());
    picture.src = he.encode(picture.src.toString());
  }

  for (const offer of point.offers) {
    offer.price = he.encode(offer.price.toString());
    offer.title = he.encode(offer.title.toString());
  }
  for (const offerForType of point.offersForType) {
    offerForType.price = he.encode(offerForType.price.toString());
    offerForType.title = he.encode(offerForType.title.toString());
  }

  return point;
};

const encodeInputToPointView = (point, destination, checkedOffers) => {
  point.type = he.encode(point.type.toString());
  point.basePrice = he.encode(point.basePrice.toString());
  point.dateFrom = he.encode(point.dateFrom.toString());
  point.dateTo = he.encode(point.dateTo.toString());
  point.isFavorite = he.encode(point.isFavorite.toString());
  destination.name = he.encode(destination.name.toString());

  for (const offer of checkedOffers) {
    offer.price = he.encode(offer.price.toString());
    offer.title = he.encode(offer.title.toString());
  }

  return { point, destination, checkedOffers };
};

const encodeInputTripInfo = (tripStartDate, tripEndDate, totalPrice, routeOfTrip) => {
  tripStartDate = he.encode(tripStartDate.toString());
  tripEndDate = he.encode(tripEndDate.toString());
  totalPrice = he.encode(totalPrice.toString());
  routeOfTrip = he.encode(routeOfTrip.toString());

  return { tripStartDate, tripEndDate, totalPrice, routeOfTrip };
};

export { formatDate, formatDuration, encodePointToCreateOrEditForm, encodeInputToPointView, encodeInputTripInfo };
