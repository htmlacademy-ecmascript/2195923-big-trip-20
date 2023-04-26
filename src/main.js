import { render } from './render.js';
import SortView from './view/sort-view.js';
import FilterView from './view/filter-view.js';
import EventsListPresenter from './presenter/events-list-presenter.js';
import TripInfoView from './view/trip-info-view.js';
import { RenderPosition } from './render.js';

const tripEventsElement = document.querySelector('.trip-events');
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripMainElement = document.querySelector('.trip-main');
const eventsListPresenter = new EventsListPresenter(tripEventsElement);

render(new TripInfoView, tripMainElement, RenderPosition.AFTERBEGIN);
render(new FilterView(), tripControlsFiltersElement);
render(new SortView(), tripEventsElement);
eventsListPresenter.init();
