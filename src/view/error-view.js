import AbstractView from '../framework/view/abstract-view.js';

function createErrorTemplate(message) {
  return `<p class="error__msg">${message}</p>`;
}

export default class ErrorView extends AbstractView {
  #message = null;

  constructor(message) {
    super();
    this.#message = message;
    setTimeout(this.#errorMessageClickHandler, 3000);
  }

  get template() {
    return createErrorTemplate(this.#message);
  }

  #removeError() {
    this.element.remove();
  }

  #errorMessageClickHandler = () => {
    this.#removeError();
  };
}
