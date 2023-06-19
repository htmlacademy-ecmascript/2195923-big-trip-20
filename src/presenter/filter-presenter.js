import FilterView from '../view/filter-view.js';
import { render, remove } from '../framework/render.js';
import { UpdateType } from '../const.js';

export default class FilterPresenter {
  #filterComponent = null;
  #filterContainer = null;
  #filtersModel = null;
  #newPointButtonModel = null;

  constructor(filterContainer, models) {
    this.#filterContainer = filterContainer;
    this.#filtersModel = models.filtersModel;
    this.#newPointButtonModel = models.newPointButtonModel;

    this.#newPointButtonModel.addObserver(this.#newPointButtonStateChangeHandler);
  }

  init() {
    this.#filterComponent = new FilterView({onFilterTypeChange: this.#filterTypeChangeHandler});
    render(this.#filterComponent, this.#filterContainer);
  }

  #filterTypeChangeHandler = (filterType) => {
    this.#filtersModel.setFilter(UpdateType.MAJOR, filterType);
  };

  #newPointButtonStateChangeHandler = () => {
    remove(this.#filterComponent);
    render(this.#filterComponent, this.#filterContainer);
    this.#filterComponent.init();
  };

  disableFilters = () => {
    this.#filterComponent.updateElement({isDisabled: true});
  };
}
