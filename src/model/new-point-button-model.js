import Observable from '../framework/observable.js';
import { UpdateType } from '../const.js';

export default class NewPointButtonModel extends Observable {
  #switch = false;

  changeStateSwitch() {
    this.#switch = !this.#switch;
    this._notify(UpdateType.PATCH, this.#switch);
  }
}
