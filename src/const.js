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
  EVERYTHING: 'everything',
  PAST: 'past',
  PRESENT: 'present',
  FUTURE: 'future',
};

const Mode = {
  DEFAULT: 'Default',
  EDIT: 'Edit',
  CREATE: 'Create',
};

const LocationElement = {
  BEFOREEND: 'beforeend',
  AFTERBEGIN: 'afterbegin',
};

const KeyboardKey = {
  ESCAPE: 'Escape',
  ESC: 'Esc',
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
};

const Message = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now',
};

const QUANTITY_OF_CITIES_IN_TRIP = 3;

export { Time, DateFormat, Filter, Mode, Message, LocationElement, KeyboardKey, sortings, QUANTITY_OF_CITIES_IN_TRIP, UserAction, UpdateType };
