import PointView from '../view/point-view.js';
import CreationOrEditingView from '../view/creation-or-editing-view.js';
import { render, replace, remove } from '../framework/render.js';
import { Mode } from '../const.js';

export default class PointPresenter {
  #point = null;
  #pointContainer = null;
  #pointComponent = null;
  #pointEditComponent = null;

  #prevPointComponent = null;
  #prevEditComponent = null;

  #handleDataChange = null;

  constructor({pointsListContainer, onDataChange}) {
    this.#pointContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
  }

  init({point, destinations, offers}) {
    this.#point = point;
    this.#prevPointComponent = this.#pointComponent;
    this.#prevEditComponent = this.#pointEditComponent;

    const destination = destinations.find((destinationElement) => destinationElement.id === this.#point.destination);
    const offersForType = offers.find((offer) => offer.type === this.#point.type);

    const checkedOffers = [];
    this.#point.offers.forEach((pointOfferId) => {
      checkedOffers.push(offersForType.offers.find((offerElement) => offerElement.id === pointOfferId));
    });

    this.#renderPoint({point: this.#point, destination: destination, offersForType: offersForType, checkedOffers: checkedOffers});
  }

  #renderPoint({point, destination, offersForType, checkedOffers}) {
    this.#pointComponent = new PointView({
      point,
      destination,
      checkedOffers,
      onEditClick: () => {
        this.#replacePointToEditForm();
        document.addEventListener('keydown', this.#escKeyDownHandler);
      },
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new CreationOrEditingView({
      point,
      destination,
      offersForType,
      mode: Mode.EDIT,
      onEditFormSubmit: () => {
        this.#replaceEditFormToPoint();
        document.removeEventListener('keydown', this.#escKeyDownHandler);
      }
    });

    if (this.#prevPointComponent === null || this.#prevEditComponent === null) {
      render(this.#pointComponent, this.#pointContainer.element);
      return;
    }

    if (this.#pointContainer.element.contains(this.#prevPointComponent.element)) {
      replace(this.#pointComponent, this.#prevPointComponent);
    }

    if (this.#pointEditComponent.element.contains(this.#prevEditComponent.element)) {
      replace(this.#pointEditComponent, this.#prevEditComponent);
    }

    remove(this.#prevPointComponent);
    remove(this.#prevEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #replacePointToEditForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
  }

  #replaceEditFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };
}

