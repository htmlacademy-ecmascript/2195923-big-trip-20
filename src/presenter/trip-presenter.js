import PointsApiService from '../api/points-api-service.js';
import OffersApiService from '../api/offers-api-service.js';
import DestinationsApiService from '../api/destinations-api-service.js';

import TripView from '../view/trip-view.js';

import PointsListPresenter from './points-list-presenter.js';
import TripInfoPresenter from './trip-info-presenter.js';
import FilterPresenter from './filter-presenter.js';

import PointsModel from '../model/points-model.js';
import OffersModel from '../model/offers-model.js';
import DestinationsModel from '../model/destinations-model.js';
import FiltersModel from '../model/filters-model.js';
import NewPointButtonModel from '../model/new-point-button-model.js';

import {render} from '../framework/render.js';
import {AUTHORIZATION, END_POINT} from '../const.js';

export default class TripPresenter {
  #tripContainer = null;
  #tripComponent = null;

  constructor({tripContainer}) {
    this.#tripContainer = tripContainer;
    this.#tripComponent = new TripView();
  }

  init() {
    render(this.#tripComponent, this.#tripContainer);

    const pointsModel = new PointsModel({pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)});
    const offersModel = new OffersModel({offersApiService: new OffersApiService(END_POINT, AUTHORIZATION)});
    const destinationsModel = new DestinationsModel({destinationsApiService: new DestinationsApiService(END_POINT, AUTHORIZATION)});
    const filtersModel = new FiltersModel();
    const newPointButtonModel = new NewPointButtonModel();

    Promise.all([offersModel.init(), destinationsModel.init(), pointsModel.init()]).then(() => {
      pointsModel.notifySuccessLoad();
    }, () => {
      pointsModel.notifyFailLoad();
    });

    const pointsListPresenter = new PointsListPresenter(
      this.#tripComponent.tripPointsContainer,
      {
        pointsModel: pointsModel,
        destinationsModel: destinationsModel,
        offersModel: offersModel,
        filtersModel: filtersModel,
        newPointButtonModel: newPointButtonModel
      });

    const tripInfoPresenter = new TripInfoPresenter({
      tripInfoContainer: this.#tripComponent.tripInfoContainer,
      models: {
        pointsModel: pointsModel,
        destinationsModel: destinationsModel,
        offersModel: offersModel
      },
      onPointCreate: pointsListPresenter.newPointButtonClickHandler,
    });

    const filterPresenter = new FilterPresenter(
      this.#tripComponent.tripFiltersContainer, {
        filtersModel: filtersModel,
        newPointButtonModel: newPointButtonModel
      }
    );

    pointsListPresenter.init({
      onNewPointSaveOrCancel: tripInfoPresenter.enableNewPointButton,
      onLoadDataFail: {
        disableNewPointButton: tripInfoPresenter.disableNewPointButton,
        disableFilters: filterPresenter.disableFilters,
      },
    });
    tripInfoPresenter.init();
    filterPresenter.init();
  }
}
