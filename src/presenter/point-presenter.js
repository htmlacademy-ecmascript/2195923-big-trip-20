import PointView from '../view/point-view.js';
import EditingView from '../view/editing-view.js';
import CreatingView from '../view/creating-view.js';
import {render, replace, remove, RenderPosition} from '../framework/render.js';
import {Mode, UserAction, UpdateType} from '../const.js';

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
  #pointCreateComponent = null;

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

  get destinationsName() {
    return this.#destinationsModel.destinationsName;
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

    if (mode !== Mode.CREATE) {
      this.#renderPoint({
        point: this.#point,
        allDestinations: this.destinations,
        allOffers: this.offers
      });
    } else {
      this.#renderFormCreatePoint();
    }

    this.#prevPointComponent = this.#pointComponent;
    this.#prevEditComponent = this.#pointEditComponent;
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
    remove(this.#pointCreateComponent);
  }

  resetView() {
    if (this.#mode === Mode.EDIT) {
      this.#pointEditComponent.reset(this.#point, this.#offersForType, this.#checkedOffers, this.#destination);
      this.#replaceEditFormToPoint();
    } else if (this.#mode === Mode.CREATE) {
      this.destroy();
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDIT) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    } else if (this.#mode === Mode.CREATE) {
      this.#pointCreateComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDIT || this.#mode === Mode.CREATE) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      if (this.#mode === Mode.EDIT) {
        this.#pointEditComponent.updateElement({
          isDisabled: false,
          isSaving: false,
          isDeleting: false,
        });
        return;
      }

      this.#pointCreateComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    if (this.#mode === Mode.EDIT) {
      this.#pointEditComponent.shake(resetFormState);
      return;
    }

    this.#pointCreateComponent.shake(resetFormState);
  }

  #getCheckedOffers(offersForType) {
    if (offersForType === undefined) {
      return undefined;
    }
    const checkedOffers = [];
    this.#point.offers?.forEach((pointOfferId) => {
      checkedOffers.push(offersForType.find((offerElement) => offerElement.id === pointOfferId));
    });
    return checkedOffers;
  }

  #getOffersForType() {
    return this.offers.find((offer) => offer.type === this.#point.type)?.offers;
  }

  #renderFormCreatePoint() {
    this.#pointCreateComponent = new CreatingView({
      allDestinations: this.destinations,
      destination: this.#destination,
      allOffers: this.offers,
      offersForType: this.#offersForType,
      checkedOffers: this.#checkedOffers,
      destinationsName: this.destinationsName,
      onCreateFormSubmit: this.#creatingFormSubmitHandler,
      onCreateFormCancel: this.#creatingFormCancelHandler,
    });

    render(this.#pointCreateComponent, this.#pointContainer.element, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  #renderPoint({point, allDestinations, allOffers}) {
    this.#pointComponent = new PointView({
      point: point,
      destination: this.#destination,
      checkedOffers: this.#checkedOffers,
      onEditClick: this.#editingFormOpenClickHandler,
      onFavoriteClick: this.#favoriteClickHadler
    });

    this.#pointEditComponent = new EditingView({
      point,
      allDestinations,
      destination: this.#destination,
      allOffers,
      offersForType: this.#offersForType,
      checkedOffers: this.#checkedOffers,
      destinationsName: this.destinationsName,
      onEditFormSubmit: this.#editingFormSubmitHandler,
      onEditFormDelete: this.#editingFormDeleteHandler,
      onEditFormCancel: this.#editingFormCancelHandler,
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

  #isRequiredFiledsFill(point) {
    const isIntegerBasePrice = Number.isInteger(point.basePrice);
    function isDate(time) {
      return new Date(time).toString() !== 'Invalid Date';
    }

    if (isIntegerBasePrice && (point.basePrice > 0) && point.destination && isDate(point.dateFrom) && isDate(point.dateTo)) {
      return true;
    }
    return false;
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
        this.#creatingFormCancelHandler();
      } else {
        this.#pointEditComponent.reset(this.#point, this.#offersForType, this.#checkedOffers, this.#destination);
        this.#replaceEditFormToPoint();
      }
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #editingFormOpenClickHandler = () => {
    this.#replacePointToEditForm();
    this.#handleNewPointCreateOrCancel();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #favoriteClickHadler = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #creatingFormSubmitHandler = (point) => {
    if (!this.#isRequiredFiledsFill(point)) {
      return;
    }

    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point);
    this.#handleNewPointCreateOrCancel();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #creatingFormCancelHandler = () => {
    this.destroy();
    this.#handleNewPointCreateOrCancel();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #editingFormSubmitHandler = (point) => {
    if (!this.#isRequiredFiledsFill(point)) {
      return;
    }

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MAJOR,
      point);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #editingFormDeleteHandler = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MAJOR,
      point);
  };

  #editingFormCancelHandler = () => {
    this.#pointEditComponent.reset(this.#point, this.#offersForType, this.#checkedOffers, this.#destination);
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };
}

