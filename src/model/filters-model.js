import Observable from '../framework/observable.js';
import { Filter } from '../const.js';


export default class FiltersModel extends Observable {
  #filters = Filter.EVERYTHING.type;

  get filters() {
    return this.#filters;
  }

  setFilters = (typeEvent, currentFilter) => {
    this.#filters = currentFilter;
    this._notify(typeEvent, this.#filters);
  };
}
