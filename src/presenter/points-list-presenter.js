import { nanoid } from 'nanoid';
import PointsListView from '../view/points-list-view.js';
import SortView from '../view/sort-view.js';
import { render } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { sortings, UpdateType, UserAction, Mode } from '../const.js';

export default class PointsListPresenter {
  #pointsListComponent = new PointsListView();
  #pointsListContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;

  #pointPresenters = new Map();
  #currentSortType = sortings[0].name;

  #handleNewPointSaveOrCancel = null;

  constructor(pointsListContainer, models) {
    this.#pointsListContainer = pointsListContainer;
    this.#pointsModel = models.pointsModel;
    this.#offersModel = models.offersModel;
    this.#destinationsModel = models.destinationsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    return this.#pointsModel.points;
  }

  get pointsListComponent() {
    return this.#pointsListComponent;
  }

  init({onNewPointSaveOrCancel}) {
    this.#handleNewPointSaveOrCancel = onNewPointSaveOrCancel;
    this.#renderSort();
    this.#renderPointList();
  }

  renderNewPoint = () => {
    this.#handleModeChange();
    this.#renderPoint({
      point: {
        basePrice: 0,
        dateFrom: new Date(),
        dateTo: new Date(),
        destination: '',
        id: nanoid(),
        isFavorite: false,
        offers: [],
        type: 'taxi',
      },
      mode: Mode.CREATE
    });
  };

  #renderPoint({point, mode}) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#pointsListComponent,
      models: {offersModel: this.#offersModel, destinationsModel: this.#destinationsModel},
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      onNewPointCreateOrCancel: this.#handleNewPointSaveOrCancel,
    });
    pointPresenter.init({point, mode});
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPointList() {
    render(this.#pointsListComponent, this.#pointsListContainer);

    this.points.forEach((point) => {
      this.#renderPoint({point: point, mode: Mode.DEFAULT});
    });
  }

  #renderSort() {
    const sortComponent = new SortView({onSortTypeChange: this.#handleSortTypeChange});
    render(sortComponent, this.#pointsListContainer);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
    //this.#handleSortTypeChange(this.#currentSortType, true);
  };

  #handleModelEvent = (updateType, point) => {
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresenters.get(point.id).init({point, mode: Mode.DEFAULT});
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderPointList();
        // - обновить список (например, когда задача ушла в архив)
        break;
      case UpdateType.MAJOR:
        this.#clearPointList();
        this.#renderPointList();
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  };

  #handleSortTypeChange = (sortType, isSaving = false) => {
    if (this.#currentSortType === sortType && !isSaving) {
      return;
    }
    const sortFunction = sortings.find((sortElement) => sortElement.name === sortType).func;
    this.points.sort(sortFunction);
    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPointList();
  };
}
