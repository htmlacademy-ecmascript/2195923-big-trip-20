import dayjs from 'dayjs';

const destinations = [];
const offerArray = [];

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
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

const destinationNames = [
  'Abakan',
  'Barnaul',
  'Veliky Novgorod',
  'Gatchina',
  'Dmitrov',
  'Yekaterinburg',
  'Zlatoust',
  'Izhevsk',
  'Yoshkar-Ola',
  'Kazan',
  'Lipetsk',
  'Magadan',
  'Norilsk',
  'Orenburg',
  'Pskov',
  'Rostov-on-Don',
  'Saint Petersburg',
  'Tolyatti',
  'Ulan-Ude',
  'Khabarovsk',
  'Cheboksary',
  'Shuya',
  'Elista',
  'Yuzhno-Sakhalinsk',
  'Yakutsk',
];

const descriptions = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
  'Cras aliquet varius magna, non porta ligula feugiat eget. ',
  'Fusce tristique felis at fermentum pharetra. ',
  'Aliquam id orci ut lectus varius viverra. ',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. ',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. ',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. ',
  'Sed sed nisi sed augue convallis suscipit in sed felis. ',
  'Aliquam erat volutpat. ',
  'Nunc fermentum tortor ac porta dapibus. ',
  'In rutrum ac purus sit amet tempus. ',
];

const offers = [
  {
    title: 'Add luggage',
    price: getRandomInteger(0, 100),
  },
  {
    title: 'Switch to comfort',
    price: getRandomInteger(0, 100),
  },
  {
    title: 'Add meal',
    price: getRandomInteger(0, 100),
  },
  {
    title: 'Choose seats',
    price: getRandomInteger(0, 100),
  },
  {
    title: 'Travel by train',
    price: getRandomInteger(0, 100),
  },
];

const generateRoutePointType = () => routePointTypes[getRandomInteger(0, routePointTypes.length - 1)];

const generateOffers = () => {
  routePointTypes.forEach((routePointType) => {
    const offer = {};
    offer.id = Math.random();
    offer.type = routePointType;
    offer.offer = [];
    for (let i = 0; i < offers.length; i++) {
      if (getRandomInteger()) {
        offer.offer.push(offers[i]);
      }
    }
    offerArray.push(offer);
  });
  return offerArray;
};

const generateDescription = (min, max) => {
  let description = '';
  const numberOfSentencesInDescription = getRandomInteger(min, max);
  for (let i = 0; i < numberOfSentencesInDescription; i++) {
    description += descriptions[getRandomInteger(0, descriptions.length - 1)];
  }
  return description;
};

const generatePictures = () => {
  const numberOfPictures = getRandomInteger(1, 5);
  return new Array(numberOfPictures).fill().map(
    () => ({ src: `https://loremflickr.com/248/152?random=${Math.random()}`, description: generateDescription(1, 1) }));
};

const generateDestination = () => {
  destinationNames.forEach((destinationName) => {
    const destination = {};
    destination.id = Math.random();
    destination.name = destinationName;
    destination.description = generateDescription(1, 5);
    destination.pictures = generatePictures();
    destinations.push(destination);
  });
};

const generateDate = () => {
  const maxDaysGap = 6;
  const maxHoursGap = 1;
  const maxMinutesGap = 30;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  const hoursGap = getRandomInteger(-maxHoursGap, maxHoursGap);
  const minutesGap = getRandomInteger(-maxMinutesGap, maxMinutesGap);

  return dayjs().add(daysGap, 'day').add(hoursGap, 'hour').add(minutesGap, 'minute');
};

const getRandomDestinationId = () => destinations[getRandomInteger(0, destinationNames.length - 1)].id;

const getOffersId = (type, isChecked = true) => {
  const checkedOffersId = [];
  for (const offerObject of offerArray) {
    if (offerObject.type === type) {
      offerObject.offer.forEach((offer) => {
        if (!isChecked || getRandomInteger(0, 1)) {
          checkedOffersId.push(offer.id);
        }
      });
    }
  }
  return checkedOffersId;
};

const getRoutePointTypes = () => routePointTypes;

const getDestinationNames = () => destinationNames;

const getDestinations = () => destinations;

generateDestination();
generateOffers();

const generatePoint = () => {
  const routePointType = generateRoutePointType();
  const dateFirst = generateDate();
  const dateSecond = generateDate();

  return {
    basePrice: getRandomInteger(100, 200),
    dateFrom: dateFirst.diff(dateSecond) < 0 ? dateFirst : dateSecond,
    dateTo: dateFirst.diff(dateSecond) >= 0 ? dateFirst : dateSecond,
    destination: getRandomDestinationId(),
    id: Math.random(),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: getOffersId(routePointType),
    type: routePointType,
  };
};

export { generatePoint, getRoutePointTypes, getDestinationNames, getDestinations, getOffersId };
