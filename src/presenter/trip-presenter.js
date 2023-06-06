import { render } from '../framework/render.js';

import TripView from '../view/trip-view.js';
import FilterView from '../view/filter-view.js';

import PointsListPresenter from './points-list-presenter.js';
import TripInfoPresenter from './trip-info-presenter.js';

import PointsModel from '../model/points-model.js';
import OffersModel from '../model/offers-model.js';
import DestinationsModel from '../model/destinations-model.js';

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

    const pointsListPresenter = new PointsListPresenter(
      this.#tripComponent.tripPointsContainer,
      {
        pointsModel: pointsModel,
        destinationsModel: destinationsModel,
        offersModel: offersModel
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

    render(new FilterView(), this.#tripComponent.tripFiltersContainer);
    tripInfoPresenter.init();
    pointsListPresenter.init({onNewPointSaveOrCancel});
  }
}
