import PointView from '../view/point-view.js';
import CreationOrEditingView from '../view/creation-or-editing-view.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';
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
  #handleNewPointCreateOrCancel = null;

  constructor({pointsListContainer, models, onDataChange, onModeChange, onNewPointCreateOrCancel}) {
    this.#pointContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#handleNewPointCreateOrCancel = onNewPointCreateOrCancel;

    this.#destinationsModel = models.destinationsModel;
    this.#offersModel = models.offersModel;
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  get offers() {
    return this.#offersModel.offers;
  }

  init({point, mode}) {
    this.#point = point;
    this.#mode = mode;
    this.#offersForType = this.#getOffersForType();
    this.#checkedOffers = this.#getCheckedOffers(this.#offersForType);
    this.#destination = this.destinations.find((destinationElement) => destinationElement.id === this.#point.destination);
    this.#prevPointComponent = this.#pointComponent;
    this.#prevEditComponent = this.#pointEditComponent;

    this.#renderPoint({
      point: this.#point,
      allDestinations: this.destinations,
      allOffers: this.offers,
      mode: this.#mode,
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

  #renderPoint({point, allDestinations, allOffers, mode}) {
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
      mode: mode,
      onCreateOrEditFormSubmit: this.#handleEditFormSubmit,
      onCreateOrEditFormDelete: this.#handleEditFormDelete,
      onCreateOrEditFormCancel: this.#handleEditFormCancel,
      onCreateFormSubmit: this.#handleCreateFormSubmit,
      onCreateFormCancel: this.#handleCreateFormCancel,
    });

    if (this.#prevPointComponent === null || this.#prevEditComponent === null) {
      if (mode === Mode.CREATE) {
        render(this.#pointEditComponent, this.#pointContainer.element, RenderPosition.AFTERBEGIN);
        document.addEventListener('keydown', this.#escKeyDownHandler);
        return;
      } else {
        render(this.#pointComponent, this.#pointContainer.element);
        return;
      }
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
    if (this.#mode === Mode.EDIT) {
      this.#pointEditComponent.reset(this.#point, this.#offersForType, this.#checkedOffers, this.#destination);
      this.#replaceEditFormToPoint();
    } else if (this.#mode === Mode.CREATE) {
      this.destroy();
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
      if (this.#mode === Mode.CREATE) {
        this.#handleCreateFormCancel();
      } else {
        this.#pointEditComponent.reset(this.#point, this.#offersForType, this.#checkedOffers, this.#destination);
        this.#replaceEditFormToPoint();
      }
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #handleEditClick = () => {
    this.#replacePointToEditForm();
    this.#handleNewPointCreateOrCancel();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #handleCreateFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point);
    this.#replaceEditFormToPoint();
    this.#handleNewPointCreateOrCancel();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleCreateFormCancel = () => {
    this.destroy();
    this.#handleNewPointCreateOrCancel();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleEditFormSubmit = (point) => {
    console.log(point);
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
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
      this.#point);
    this.#pointEditComponent.reset(this.#point, this.#offersForType, this.#checkedOffers, this.#destination);
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}

