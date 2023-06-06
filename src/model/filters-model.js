import Observable from '../framework/observable.js';
import { Filter } from '../const.js';


export default class FiltersModel extends Observable {
  #filters = Filter.EVERYTHING;

  get filters() {
    return this.#filters;
  }

  set filters(currentFilter) {
    this.#filters = currentFilter;
    this._notify('MAJOR', this.#filters);
  }
}
