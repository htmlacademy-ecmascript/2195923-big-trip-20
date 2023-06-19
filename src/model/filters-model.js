import Observable from '../framework/observable.js';
import {Filter} from '../const.js';

export default class FiltersModel extends Observable {
  #filter = Filter.EVERYTHING.type;

  get filter() {
    return this.#filter;
  }

  setFilter(typeEvent, currentFilter) {
    this.#filter = currentFilter;
    this._notify(typeEvent, this.#filter);
  }
}
