import { nanoid } from 'nanoid';
import PointsListView from '../view/points-list-view.js';
import EmptyPointView from '../view/empty-point-view.js';
import SortView from '../view/sort-view.js';
import { render, remove } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { sortings, UpdateType, UserAction, Mode, Message, Filter } from '../const.js';

export default class PointsListPresenter {
  #pointsListComponent = new PointsListView();
  #emptyComponent = null;
  #sortComponent = null;
  #pointsListContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filtersModel = null;

  #pointPresenters = new Map();
  #currentSortType = sortings[0].name;

  #handleNewPoint = null;

  constructor(pointsListContainer, models) {
    this.#pointsListContainer = pointsListContainer;
    this.#pointsModel = models.pointsModel;
    this.#offersModel = models.offersModel;
    this.#destinationsModel = models.destinationsModel;
    this.#filtersModel = models.filtersModel;
    this.#sortComponent = new SortView({onSortTypeChange: this.#handleSortTypeChange});

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleFiltersEvent);
  }

  get points() {
    if (this.#filtersModel.filters === 'past') {
      return this.#pointsModel.points.filter((point) => Date.parse(point.dateTo) < Date.now());
    } else if (this.#filtersModel.filters === 'present') {
      return this.#pointsModel.points.filter((point) => (Date.parse(point.dateFrom) < Date.now() && Date.parse(point.dateTo) > Date.now()));
    } else if (this.#filtersModel.filters === 'future') {
      return this.#pointsModel.points.filter((point) => Date.parse(point.dateFrom) > Date.now());
    }
    return this.#pointsModel.points;
  }

  get pointsListComponent() {
    return this.#pointsListComponent;
  }

  init({onNewPointSaveOrCancel}) {
    this.#handleNewPoint = onNewPointSaveOrCancel;
    if (this.points.length) {
      this.#renderSort();
      this.#renderPointList();
    } else {
      this.#renderEmptyList();
    }
  }

  #handleNewPointSaveOrCancel = () => {
    this.#handleNewPoint();
    if (!this.points.length) {
      this.#renderEmptyList();
    }
  };

  renderNewPoint = () => {
    if (this.#emptyComponent) {
      remove(this.#emptyComponent);
      render(this.#sortComponent, this.#pointsListContainer);
      render(this.#pointsListComponent, this.#pointsListContainer);
    }
    this.#handleSortTypeChange('day', true);
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

  #renderEmptyList(message) {
    this.#emptyComponent = new EmptyPointView(message);
    render(this.#emptyComponent, this.#pointsListContainer);
  }

  #renderSort() {
    render(this.#sortComponent, this.#pointsListContainer);
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
        this.#handleSortTypeChange(this.#currentSortType, true);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        this.#handleSortTypeChange(this.#currentSortType, true);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        this.#handleSortTypeChange(this.#currentSortType, true);
        break;
    }
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
        if (this.points.length) {
          this.#renderPointList();
        } else {
          remove(this.#sortComponent);
          render(this.#pointsListComponent, this.#pointsListContainer);
          this.#renderEmptyList(Message.EVERYTHING);
        }
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
  };

  #handleFiltersEvent = (updateType, filter) => {
    switch (updateType) {
      case UpdateType.PATCH:
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
        this.#clearPointList();
        if (this.points.length) {
          remove(this.#emptyComponent);
          render(this.#sortComponent, this.#pointsListContainer);
          this.#renderPointList();
        } else {
          remove(this.#sortComponent);
          remove(this.#emptyComponent);
          render(this.#pointsListComponent, this.#pointsListContainer);
          if (filter === Filter.FUTURE) {
            this.#renderEmptyList(Message.FUTURE);
          } else if (filter === Filter.PRESENT) {
            this.#renderEmptyList(Message.PRESENT);
          } else if (filter === Filter.PAST) {
            this.#renderEmptyList(Message.PAST);
          } else if (filter === Filter.EVERYTHING) {
            this.#renderEmptyList(Message.EVERYTHING);
          }
        }
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
