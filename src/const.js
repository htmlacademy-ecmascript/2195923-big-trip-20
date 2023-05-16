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
  EVERYTHING: 'Everthing',
  PAST: 'Past',
  FUTURE: 'Future',
};

const Mode = {
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

const QUANTITY_OF_CITIES_IN_TRIP = 3;

export { Time, DateFormat, Filter, Mode, LocationElement, KeyboardKey, QUANTITY_OF_CITIES_IN_TRIP };
