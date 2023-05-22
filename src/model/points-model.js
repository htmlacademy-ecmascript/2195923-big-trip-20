import { getPoint } from '../mock/point-mock.js';

const POINT_COUNT = 4;

export default class PointsModel {
  #points = Array.from({length: POINT_COUNT}, getPoint);

  get points() {
    return this.#points;
  }
}
