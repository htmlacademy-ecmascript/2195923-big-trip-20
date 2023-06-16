import dayjs from 'dayjs';

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
    func: () => true,
  },
  PAST: {
    type: 'past',
    message: 'There are no past events now',
    func: (point) => Date.parse(point.dateTo) < Date.now(),
  },
  PRESENT: {
    type: 'present',
    message: 'There are no present events now',
    func: (point) => (Date.parse(point.dateFrom) <= Date.now() && Date.parse(point.dateTo) >= Date.now()),
  },
  FUTURE: {
    type: 'future',
    message: 'There are no future events now',
    func: (point) => Date.parse(point.dateFrom) > Date.now(),
  }
};

const Mode = {
  DEFAULT: 'Default',
  EDIT: 'Edit',
  CREATE: 'Create',
};


const sortings = [
  {
    name: 'day',
    attribute: 'checked',
    func: (point1, point2) => dayjs(point1.dateFrom) - dayjs(point2.dateFrom),
  },
  {
    name: 'event',
    attribute: 'disabled',
    func: () => {},
  },
  {
    name: 'time',
    attribute: '',
    func: (point1, point2) => (dayjs(point2.dateTo) - dayjs(point2.dateFrom)) - (dayjs(point1.dateTo) - dayjs(point1.dateFrom)),
  },
  {
    name: 'price',
    attribute: '',
    func: (point1, point2) => point2.basePrice - point1.basePrice,
  },
  {
    name: 'offers',
    attribute: 'disabled',
    func: () => {},
  }
];

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

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: '',
  dateTo: '',
  destination: '',
  isFavorite: false,
  offers: [],
  type: 'taxi',
};

const routePointTypes = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const AUTHORIZATION = 'Basic dPy4sfS45wcl1sh2I';
const END_POINT = 'https://20.ecmascript.pages.academy/big-trip';
const SERVER_UNAVAILABLE_MESSAGE = 'The server is unavailable. Try to reload the page';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000
};

export { Time, DateFormat, Filter, Mode, sortings, routePointTypes, UserAction, UpdateType, BLANK_POINT, AUTHORIZATION, END_POINT, TimeLimit, SERVER_UNAVAILABLE_MESSAGE };
