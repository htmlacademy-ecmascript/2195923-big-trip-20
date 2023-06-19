import AbstractView from '../framework/view/abstract-view.js';

function createEmptyPointTemplate(message) {
  return `<p class="trip-events__msg">${message}</p>`;
}

export default class EmptyPointView extends AbstractView {
  #message = null;

  constructor(message) {
    super();
    this.#message = message;
  }

  get template() {
    return createEmptyPointTemplate(this.#message);
  }
}
