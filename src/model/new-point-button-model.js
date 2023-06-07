import Observable from '../framework/observable.js';

export default class NewPointButtonModel extends Observable {
  #switch = false;

  getStateSwitchButton() {
    return this.#switch;
  }

  changeStateSwitchButton() {
    this.#switch = !this.#switch;
    this._notify('PATCH', this.#switch);
  }
}
