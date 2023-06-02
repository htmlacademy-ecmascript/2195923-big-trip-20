import PointView from '../view/point-view.js';
import CreationOrEditingView from '../view/creation-or-editing-view.js';
import { render, replace, remove } from '../framework/render.js';
import { Mode, UserAction, UpdateType } from '../const.js';

export default class PointPresenter {
  #point = null;
  #destinationsModel = null;
  #offersModel = null;

  #offersForType = null;
  #checkedOffers = null;
  #destination = null;

  #mode = Mode.DEFAULT;

  #pointContainer = null;
  #pointComponent = null;
  #pointEditComponent = null;

  #prevPointComponent = null;
  #prevEditComponent = null;

  #handleDataChange = null;
  #handleModeChange = null;

  constructor({pointsListContainer, models, onDataChange, onModeChange}) {
    this.#pointContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;

    this.#destinationsModel = models.destinationsModel;
    this.#offersModel = models.offersModel;
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  get offers() {
    return this.#offersModel.offers;
  }

  init({point}) {
    this.#point = point;
    this.#offersForType = this.#getOffersForType();
    this.#checkedOffers = this.#getCheckedOffers(this.#offersForType);
    this.#destination = this.destinations.find((destinationElement) => destinationElement.id === this.#point.destination);
    this.#prevPointComponent = this.#pointComponent;
    this.#prevEditComponent = this.#pointEditComponent;

    this.#renderPoint({
      point: this.#point,
      allDestinations: this.destinations,
      allOffers: this.offers
    });
  }

  #getCheckedOffers(offersForType) {
    const checkedOffers = [];
    this.#point.offers?.forEach((pointOfferId) => {
      checkedOffers.push(offersForType.find((offerElement) => offerElement.id === pointOfferId));
    });
    return checkedOffers;
  }

  #getOffersForType() {
    return this.offers.find((offer) => offer.type === this.#point.type).offers;
  }

  #renderPoint({point, allDestinations, allOffers}) {
    this.#pointComponent = new PointView({
      point: point,
      destination: this.#destination,
      checkedOffers: this.#checkedOffers,
      onEditClick: this.#handleEditClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new CreationOrEditingView({
      point,
      allDestinations,
      destination: this.#destination,
      allOffers,
      offersForType: this.#offersForType,
      checkedOffers: this.#checkedOffers,
      mode: Mode.EDIT,
      onCreatOrEditFormSubmit: this.#handleEditFormSubmit,
      onCreateOrEditFormDelete: this.#handleEditFormDelete,
      onCreateOrEditFormCancel: this.#handleEditFormCancel,
    });

    if (this.#prevPointComponent === null || this.#prevEditComponent === null) {
      render(this.#pointComponent, this.#pointContainer.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, this.#prevPointComponent);
    }

    if (this.#mode === Mode.EDIT) {
      replace(this.#pointEditComponent, this.#prevEditComponent);
    }

    remove(this.#prevPointComponent);
    remove(this.#prevEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point, this.#offersForType, this.#checkedOffers, this.#destination);
      this.#replaceEditFormToPoint();
    }
  }

  #replacePointToEditForm() {
    replace(this.#pointEditComponent, this.#pointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDIT;
  }

  #replaceEditFormToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point, this.#offersForType, this.#checkedOffers, this.#destination);
      this.#replaceEditFormToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleEditClick = () => {
    this.#replacePointToEditForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleEditFormSubmit = (point, mode) => {
    this.#handleDataChange(
      mode.EDIT ? UserAction.UPDATE_POINT : UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point);
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleEditFormDelete = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MAJOR,
      point);
  };

  #handleEditFormCancel = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point);
    this.#pointEditComponent.reset(this.#point, this.#offersForType, this.#checkedOffers, this.#destination);
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}

