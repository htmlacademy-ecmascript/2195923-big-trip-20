import FilterView from '../view/filter-view.js';
import { render, remove } from '../framework/render.js';

export default class FilterPresenter {
  #filterComponent = null;
  #filterContainer = null;
  #filtersModel = null;
  #newPointButtonModel = null;

  constructor(filterContainer, models) {
    this.#filterContainer = filterContainer;
    this.#filtersModel = models.filtersModel;
    this.#newPointButtonModel = models.newPointButtonModel;

    this.#newPointButtonModel.addObserver(this.#handleNewPointButtonClick);
  }

  init() {
    this.#filterComponent = new FilterView({onFilterTypeChange: this.#handleFilterTypeChange});
    render(this.#filterComponent, this.#filterContainer);
  }

  #handleFilterTypeChange = (filterType) => {
    this.#filtersModel.setFilters('MAJOR', filterType);
  };

  #handleNewPointButtonClick = () => {
    remove(this.#filterComponent);
    render(this.#filterComponent, this.#filterContainer);
    this.#filterComponent.setHandlers();
  };
}
