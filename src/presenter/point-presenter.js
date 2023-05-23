import PointView from '../view/point-view.js';
import CreationOrEditingView from '../view/creation-or-editing-view.js';
import { render, replace } from '../framework/render.js';
import { Mode } from '../const.js';

export default class PointPresenter {
  #pointContainer = null;

  constructor(pointContainer) {
    this.#pointContainer = pointContainer;
  }

  init({point, destinations, offers}) {
    const destination = destinations.find((destinationElement) => destinationElement.id === point.destination);
    const offersForType = offers.find((offer) => offer.type === point.type);

    const checkedOffers = [];
    point.offers.forEach((pointOfferId) => {
      checkedOffers.push(offersForType.offers.find((offerElement) => offerElement.id === pointOfferId));
    });

    this.#renderPoint({point: point, destination: destination, offersForType: offersForType, checkedOffers: checkedOffers});
  }

  #renderPoint({point, destination, offersForType, checkedOffers}) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      point,
      destination,
      checkedOffers,
      onEditClick: () => {
        replacePointToEditForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new CreationOrEditingView({
      point,
      destination,
      offersForType,
      mode: Mode.EDIT,
      onEditFormSubmit: () => {
        replaceEditFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToEditForm() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceEditFormToPoint() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#pointContainer.element);
  }
}

