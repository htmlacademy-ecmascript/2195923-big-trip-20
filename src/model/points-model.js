import { getPoint } from '../mock/point-mock.js';

const POINT_COUNT = 5;

export default class PointsModel {
  #points = Array.from({length: POINT_COUNT}, getPoint);

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
}
