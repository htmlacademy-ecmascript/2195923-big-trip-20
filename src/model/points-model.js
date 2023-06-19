import Observable from '../framework/observable.js';
import {UpdateType, Sorting} from '../const.js';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #sortingPoints = [];

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points;
  }

  get tripStartDate() {
    return this.#sortingPoints[0].dateFrom;
  }

  get tripEndDate() {
    return this.#sortingPoints[this.#sortingPoints.length - 1].dateTo;
  }

  get totalPrice() {
    return this.#points.reduce((totalPrice, point) => totalPrice + point.basePrice, 0);
  }

  get destinationIds() {
    return this.#sortingPoints.map((point) => point.destination);
  }

  async init() {
    const points = await this.#pointsApiService.points;
    this.#points = points.map(this.#pointsApiService.adaptToClient);
    this.#sortPoints();
    return this.#points;
  }

  notifySuccessLoad() {
    this._notify(UpdateType.INIT_SUCCESS);
  }

  notifyFailLoad() {
    this._notify(UpdateType.INIT_FAIL);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#pointsApiService.adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        update,
        ...this.#points.slice(index + 1),
      ];
      this.#sortPoints();
      this._notify(updateType, updatedPoint);

    } catch(err) {
      if (err.message === 'Failed to fetch') {
        throw new Error('The server is unavailable');
      }
      throw new Error('All form fields must be completed');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#pointsApiService.adaptToClient(response);
      this.#points = [
        newPoint,
        ...this.#points,
      ];
      this.#sortPoints();
      this._notify(updateType, update);
    } catch (err) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    try {
      await this.#pointsApiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this.#sortPoints();
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  }

  #sortPoints() {
    this.#sortingPoints = this.points;
    this.#sortingPoints.sort(Object.values(Sorting).find((sortElement) => sortElement.name === Sorting.DAY.name).sort);
  }
}
