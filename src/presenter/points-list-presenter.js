import PointsListView from '../view/points-list-view.js';
import { render } from '../framework/render.js';
import PointPresenter from './point-presenter.js';

export default class PointsListPresenter {
  #pointsListComponent = new PointsListView();
  #pointsListContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #routePoints = [];
  #destinations = [];
  #offers = [];


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

    this.#renderPointList();
  }

  #renderPoint({point, destinations, offers}) {
    const pointPresenter = new PointPresenter(this.#pointsListComponent);
    pointPresenter.init({point, destinations, offers});
  }

  #renderPointList() {
    render(this.#pointsListComponent, this.#pointsListContainer);

    for (let i = 0; i < this.#routePoints.length; i++) {
      this.#renderPoint({point: this.#routePoints[i], destinations: this.#destinations, offers: this.#offers});
    }
  }
}
