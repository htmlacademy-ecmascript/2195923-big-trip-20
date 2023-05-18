import { render } from './render.js';
import SortView from './view/sort-view.js';
import FilterView from './view/filter-view.js';
import PointsListPresenter from './presenter/points-list-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';

const tripEventsElement = document.querySelector('.trip-events');
const tripControlsFiltersElement = document.querySelector('.trip-controls__filters');
const tripMainElement = document.querySelector('.trip-main');

const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const pointsListPresenter = new PointsListPresenter(
  tripEventsElement,
  {
    pointsModel: pointsModel,
    destinationsModel: destinationsModel,
    offersModel: offersModel
  });
const tripInfoPresenter = new TripInfoPresenter(
  tripMainElement,
  {
    pointsModel: pointsModel,
    destinationsModel: destinationsModel,
    offersModel: offersModel
  });

render(new FilterView(), tripControlsFiltersElement);
render(new SortView(), tripEventsElement);
tripInfoPresenter.init();
pointsListPresenter.init();
