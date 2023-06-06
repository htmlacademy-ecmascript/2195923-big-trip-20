import dayjs from 'dayjs';
import Observable from '../framework/observable.js';
import { getPoint } from '../mock/point-mock.js';

const POINT_COUNT = 0;

export default class PointsModel extends Observable {
  #points = Array.from({length: POINT_COUNT}, getPoint).sort((point1, point2) => dayjs(point1.dateFrom) - dayjs(point2.dateFrom));

  get points() {
    return this.#points;
  }

  get tripStartDate() {
    return this.#points[0].dateFrom;
  }

  get tripEndDate() {
    return this.#points[this.#points.length - 1].dateTo;
  }

  get totalPrice() {
    return this.#points.reduce((totalPrice, point) => totalPrice + point.basePrice, 0);
  }

  get destinationIds() {
    return this.#points.map((point) => point.destination);
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
