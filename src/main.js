import TripPresenter from './presenter/trip-presenter.js';

const body = document.querySelector('body');

const tripPresenter = new TripPresenter({tripContainer: body});
tripPresenter.init();
