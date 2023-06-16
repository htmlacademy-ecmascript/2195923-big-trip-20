import AbstractStatefulView from '../framework/view/abstract-stateful-view';

function createFilterTemplate(filtersState) {
  return (
    `<div class="trip-main__trip-controls  trip-controls">
      <div class="trip-controls__filters">
        <h2 class="visually-hidden">Filter events</h2>
        <form class="trip-filters" action="#" method="get">
          <div class="trip-filters__filter">
            <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked ${filtersState.isDisabled ? 'disabled' : ''}>
            <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
          </div>

          <div class="trip-filters__filter">
            <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" ${filtersState.isDisabled ? 'disabled' : ''}>
            <label class="trip-filters__filter-label" for="filter-future">Future</label>
          </div>

          <div class="trip-filters__filter">
            <input id="filter-present" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="present" ${filtersState.isDisabled ? 'disabled' : ''}>
            <label class="trip-filters__filter-label" for="filter-present">Present</label>
          </div>

          <div class="trip-filters__filter">
            <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" ${filtersState.isDisabled ? 'disabled' : ''}>
            <label class="trip-filters__filter-label" for="filter-past">Past</label>
          </div>

          <button class="visually-hidden" type="submit">Accept filter</button>
        </form>
      </div>
    </div>`
  );
}

export default class FilterView extends AbstractStatefulView {
  #handleFilterTypeChange = null;

  constructor({onFilterTypeChange}) {
    super();
    this.#handleFilterTypeChange = onFilterTypeChange;
    this._setState({isDisabled: false});
    this._restoreHandlers();
  }

  get template() {
    return createFilterTemplate(this._state);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();

    this.#handleFilterTypeChange(evt.target.value);
  };

  setHandlers() {
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  _restoreHandlers() {
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }
}
