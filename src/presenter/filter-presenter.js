import FilterView from '../view/filter-view.js';
import { render } from '../framework/render.js';

export default class FilterPresenter {
  #filterComponent = null;
  #filterContainer = null;
  #filtersModel = null;

  constructor(filterContainer, filtersModel) {
    this.#filterContainer = filterContainer;
    this.#filtersModel = filtersModel;
  }

  init() {
    this.#filterComponent = new FilterView({onFilterTypeChange: this.#handleFilterTypeChange});
    render(this.#filterComponent, this.#filterContainer);
  }

  #handleFilterTypeChange = (filterType) => {
    this.#filtersModel.filters = filterType;
  };
}
