import PointsListView from '../view/points-list-view.js';
import SortView from '../view/sort-view.js';
import { render } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils.js';
import { sortings } from '../const.js';

export default class PointsListPresenter {
  #pointsListComponent = new PointsListView();
  #pointsListContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #routePoints = [];
  #destinations = [];
  #offers = [];
  #pointPresenters = new Map();
  #currentSortType = sortings[0].name;

  constructor(pointsListContainer, models) {
    this.#pointsListContainer = pointsListContainer;

    const {pointsModel, destinationsModel, offersModel} = models;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#routePoints = [...this.#pointsModel.points];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    this.#renderSort();
    this.#renderPointList();
  }

  #renderPoint({point, destinations, offers}) {
    const pointPresenter = new PointPresenter({
      pointsListContainer: this.#pointsListComponent,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init({point, destinations, offers});
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #renderPointList() {
    render(this.#pointsListComponent, this.#pointsListContainer);

    for (let i = 0; i < this.#routePoints.length; i++) {
      this.#renderPoint({point: this.#routePoints[i], destinations: this.#destinations, offers: this.#offers});
    }
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

  #handlePointChange = (updatedPoint) => {
    this.#routePoints = updateItem(this.#routePoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init({point: updatedPoint, destinations: this.#destinations, offers: this.#offers});
    this.#handleSortTypeChange(this.#currentSortType, true);
  };

  #handleSortTypeChange = (sortType, isSaving = false) => {
    if (this.#currentSortType === sortType && !isSaving) {
      return;
    }
    const sortFunction = sortings.find((sortElement) => sortElement.name === sortType).func;
    this.#routePoints.sort(sortFunction);
    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPointList();
  };
}
