import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { Time, DateFormat } from './const.js';

dayjs.extend(duration);

const formatDate = (date, format) => dayjs(date).format(format);

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

export { formatDate, formatDuration };
