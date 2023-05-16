import { render } from './render.js';
import SortView from './view/sort-view.js';
import FilterView from './view/filter-view.js';
import EventsListPresenter from './presenter/events-list-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsModel from './model/points-model.js';

const tripEventsElement = document.querySelector('.trip-events');
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripMainElement = document.querySelector('.trip-main');

const pointsModel = new PointsModel();
const eventsListPresenter = new EventsListPresenter(tripEventsElement, pointsModel);
const tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);

render(new FilterView(), tripControlsFiltersElement);
render(new SortView(), tripEventsElement);
tripInfoPresenter.init();
eventsListPresenter.init();
