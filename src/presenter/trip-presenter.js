import { render } from '../framework/render.js';

import TripView from '../view/trip-view.js';

import PointsListPresenter from './points-list-presenter.js';
import TripInfoPresenter from './trip-info-presenter.js';
import FilterPresenter from './filter-presenter.js';

import PointsModel from '../model/points-model.js';
import OffersModel from '../model/offers-model.js';
import DestinationsModel from '../model/destinations-model.js';
import FiltersModel from '../model/filters-model.js';
import NewPointButtonModel from '../model/new-point-button-model.js';

export default class TripPresenter {
  #tripContainer = null;
  #tripComponent = null;

  constructor({tripContainer}) {
    this.#tripContainer = tripContainer;
    this.#tripComponent = new TripView();
  }

  init() {
    render(this.#tripComponent, this.#tripContainer);

    const pointsModel = new PointsModel();
    const offersModel = new OffersModel();
    const destinationsModel = new DestinationsModel();
    const filtersModel = new FiltersModel();
    const newPointButtonModel = new NewPointButtonModel();

    const pointsListPresenter = new PointsListPresenter(
      this.#tripComponent.tripPointsContainer,
      {
        pointsModel: pointsModel,
        destinationsModel: destinationsModel,
        offersModel: offersModel,
        filtersModel: filtersModel,
        newPointButtonModel: newPointButtonModel
      });

    const onPointCreate = pointsListPresenter.renderNewPoint;

    const tripInfoPresenter = new TripInfoPresenter(
      this.#tripComponent.tripInfoContainer,
      {
        pointsModel: pointsModel,
        destinationsModel: destinationsModel,
        offersModel: offersModel
      },
      onPointCreate);

    const onNewPointSaveOrCancel = tripInfoPresenter.enableNewPoint;

    const filterPresenter = new FilterPresenter(
      this.#tripComponent.tripFiltersContainer, {
        filtersModel: filtersModel,
        newPointButtonModel: newPointButtonModel
      }
    );

    tripInfoPresenter.init();
    pointsListPresenter.init({onNewPointSaveOrCancel});
    filterPresenter.init();
  }
}
