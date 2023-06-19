import dayjs from 'dayjs';

const AUTHORIZATION = 'Basic dPy4sfS45wcl1sh2I';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';
const SERVER_UNAVAILABLE_MESSAGE = 'The server is unavailable. Please try again later';

const Time = {
  HOURS_PER_DAY: 24,
  MINUTES_PER_HOUR: 60,
  MINUTES_PER_DAY: 1440,
};

const DateFormat = {
  ONLY_DATE_MAIN: 'YYYY-MM-DD',
  ONLY_DATE_SECONDARY: 'MMM DD',
  ONLY_DATE_TERTIARY: 'D MMM',
  FULL_DATE: 'DD/MM/YY HH:mm',
  DATETIME_ATTRIBUTE: 'YYYY-MM-DD[T]HH:mm',
  ONLY_TIME: 'HH:mm',
  ONLY_TIME_WITH_DESCRIPTION: 'HH[H] mm[M]',
  ONLY_MINUTES_WITH_DESCRIPTION: 'mm[M]',
  FULL_DURATION: 'DD[D] HH[H] mm[M]',
};

const Filter = {
  EVERYTHING: {
    type: 'everything',
    message: 'Click New Event to create your first point',
    filter: () => true,
  },
  PAST: {
    type: 'past',
    message: 'There are no past events now',
    filter: (point) => Date.parse(point.dateTo) < Date.now(),
  },
  PRESENT: {
    type: 'present',
    message: 'There are no present events now',
    filter: (point) => (Date.parse(point.dateFrom) <= Date.now() && Date.parse(point.dateTo) >= Date.now()),
  },
  FUTURE: {
    type: 'future',
    message: 'There are no future events now',
    filter: (point) => Date.parse(point.dateFrom) > Date.now(),
  },
};

const Mode = {
  DEFAULT: 'Default',
  EDIT: 'Edit',
  CREATE: 'Create',
};

const Sorting = {
  DAY: {
    name: 'day',
    attribute: 'checked',
    sort: (firstPoint, secondPoint) => dayjs(firstPoint.dateFrom) - dayjs(secondPoint.dateFrom),
  },
  EVENT: {
    name: 'event',
    attribute: 'disabled',
    sort: () => {},
  },
  TIME: {
    name: 'time',
    attribute: '',
    sort: (firstPoint, secondPoint) => (dayjs(secondPoint.dateTo) - dayjs(secondPoint.dateFrom)) - (dayjs(firstPoint.dateTo) - dayjs(firstPoint.dateFrom)),
  },
  PRICE: {
    name: 'price',
    attribute: '',
    sort: (firstPoint, secondPoint) => secondPoint.basePrice - firstPoint.basePrice,
  },
  OFFER: {
    name: 'offers',
    attribute: 'disabled',
    sort: () => {},
  },
};

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT_SUCCESS: 'INIT_SUCCESS',
  INIT_FAIL: 'INIT_FAIL',
};

const RoutePointType = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant',
};

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: '',
  isFavorite: false,
  offers: [],
  type: RoutePointType.TAXI,
};

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export {
  Time,
  DateFormat,
  Filter,
  Mode,
  Sorting,
  RoutePointType,
  UserAction,
  UpdateType,
  BLANK_POINT,
  AUTHORIZATION,
  END_POINT,
  TimeLimit,
  SERVER_UNAVAILABLE_MESSAGE,
  Method,
};
