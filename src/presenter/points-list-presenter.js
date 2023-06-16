import PointsListView from '../view/points-list-view.js';
import EmptyPointView from '../view/empty-point-view.js';
import SortView from '../view/sort-view.js';
import LoadingView from '../view/loading-view.js';

import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

import { render, remove, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { sortings, UpdateType, UserAction, Mode, Filter, BLANK_POINT, TimeLimit } from '../const.js';

export default class PointsListPresenter {
  #pointsListComponent = new PointsListView();
  #emptyComponent = null;
  #sortComponent = null;
  #loadingComponent = null;
  #pointsListContainer = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #filtersModel = null;
  #newPointButtonModel = null;

  #pointPresenters = new Map();
  #creatingPointPresenters = null;
  #currentSortType = sortings[0].name;

  #handleNewPoint = null;

  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor(pointsListContainer, models) {
    this.#pointsListContainer = pointsListContainer;
    this.#pointsModel = models.pointsModel;
    this.#offersModel = models.offersModel;
    this.#destinationsModel = models.destinationsModel;
    this.#filtersModel = models.filtersModel;
    this.#newPointButtonModel = models.newPointButtonModel;
    this.#sortComponent = new SortView({onSortTypeChange: this.#handleSortTypeChange});
    this.#loadingComponent = new LoadingView();

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleFiltersEvent);
    this.#newPointButtonModel.addObserver(this.#handleSortEvent);
  }

  get points() {
    const filterPoint = this.#pointsModel.points.filter(Filter[this.#filtersModel.filters.toUpperCase()].func);
    const sortFunction = sortings.find((sortElement) => sortElement.name === this.#currentSortType).func;
    return filterPoint.sort(sortFunction);
  }

  get pointsListComponent() {
    return this.#pointsListComponent;
  }

  init({onNewPointSaveOrCancel}) {
    this.#handleNewPoint = onNewPointSaveOrCancel;
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

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
    this.#newPointButtonModel.changeStateSwitchButton();
    if (this.#emptyComponent) {
      remove(this.#emptyComponent);
      render(this.#sortComponent, this.#pointsListContainer);
      render(this.#pointsListComponent, this.#pointsListContainer);
    }
    this.#filtersModel.setFilters('PATCH', Filter.EVERYTHING.type);
    this.#handleSortTypeChange('day', true);

    this.#handleModeChange();
    this.#creatingPointPresenters = new PointPresenter({
      pointsListContainer: this.#pointsListComponent,
      models: {offersModel: this.#offersModel, destinationsModel: this.#destinationsModel},
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      onNewPointCreateOrCancel: this.#handleNewPointSaveOrCancel,
    });
    this.#creatingPointPresenters.init({point: BLANK_POINT, mode: Mode.CREATE});
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

  #renderLoading() {
    render(this.#loadingComponent, this.#pointsListContainer);
  }

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    remove(this.#loadingComponent);
    this.#pointPresenters.clear();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#creatingPointPresenters.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#creatingPointPresenters.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, point) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(point.id).init({point, mode: Mode.DEFAULT});
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderPointList();
        break;
      case UpdateType.MAJOR:
        this.#creatingPointPresenters?.destroy();
        this.#clearPointList();
        if (this.points.length) {
          this.#renderPointList();
        } else {
          remove(this.#sortComponent);
          render(this.#pointsListComponent, this.#pointsListContainer);
          this.#renderEmptyList(Filter[this.#filtersModel.filters.toUpperCase()].message);
        }
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderSort();
        this.#renderPointList();
        break;
    }
  };

  #handleFiltersEvent = (updateType, filter) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#sortComponent.setHandlers();
        break;
      case UpdateType.MINOR:
      case UpdateType.MAJOR:
        this.#clearPointList();
        if (this.points.length) {
          remove(this.#emptyComponent);
          render(this.#sortComponent, this.#pointsListContainer);
          this.#sortComponent.setHandlers();
          this.#renderPointList();
        } else {
          remove(this.#sortComponent);
          remove(this.#emptyComponent);
          render(this.#pointsListComponent, this.#pointsListContainer);
          if (filter === Filter.FUTURE.type) {
            this.#renderEmptyList(Filter.FUTURE.message);
          } else if (filter === Filter.PRESENT.type) {
            this.#renderEmptyList(Filter.PRESENT.message);
          } else if (filter === Filter.PAST.type) {
            this.#renderEmptyList(Filter.PAST.message);
          } else if (filter === Filter.EVERYTHING.type) {
            this.#renderEmptyList(Filter.EVERYTHING.message);
          }
        }
        break;
    }
  };

  #handleSortEvent = () => {
    remove(this.#sortComponent);
    render(this.#sortComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setHandlers();
  };

  #handleSortTypeChange = (sortType, isSaving = false) => {
    if (this.#currentSortType === sortType && !isSaving) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPointList();
  };
}
