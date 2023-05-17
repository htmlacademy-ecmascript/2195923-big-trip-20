import { createElement } from '../render.js';

function createPointsListTemplate() {
  return '<ul class="trip-events__list"></ul>';
}

export default class PointsListView {
  getTemplate() {
    return createPointsListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
