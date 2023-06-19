import AbstractView from '../framework/view/abstract-view.js';
import {Sorting} from '../const.js';

function createSortTemplate() {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${createSortingList()}
    </form>`
  );
}

function createSortElement(sortingElement) {
  return `<div class="trip-sort__item  trip-sort__item--${sortingElement.name}">
            <input id="sort-${sortingElement.name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortingElement.name}" ${sortingElement.attribute}>
            <label class="trip-sort__btn" for="sort-${sortingElement.name}">${sortingElement.name}</label>
          </div>`;
}

function createSortingList() {
  let sortTemplate = '';
  for (const sorting of Object.values(Sorting)) {
    sortTemplate += createSortElement(sorting);
  }
  return sortTemplate;
}

export default class SortView extends AbstractView {
  #handleSortTypeChange = null;

  constructor({onSortTypeChange}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.setHandlers();
  }

  get template() {
    return createSortTemplate();
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    const sortType = evt.target.id.split('-')[1];
    this.#handleSortTypeChange(sortType);
  };

  setHandlers() {
    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }
}
