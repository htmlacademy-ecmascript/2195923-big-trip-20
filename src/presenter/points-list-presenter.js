import PointsListView from '../view/points-list-view.js';
import PointView from '../view/point-view.js';
import CreationOrEditingView from '../view/creation-or-editing-view.js';
import { render, replace } from '../framework/render.js';
import { Mode } from '../const.js';

export default class PointsListPresenter {
  #pointsListComponent = new PointsListView();
  #pointsListContainer = null;
  #pointsModel = null;
  #destinationsModel = null;
  #offersModel = null;

  #routePoints = [];
  #destinations = [];
  #offers = [];


  constructor(pointsListContainer, models) {
    this.#pointsListContainer = pointsListContainer;

    const {pointsModel, destinationsModel, offersModel} = models;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
  }

  init() {
    this.#routePoints = [...this.#pointsModel.points];
    this.#destinations = [...this.#destinationsModel.destinations];
    this.#offers = [...this.#offersModel.offers];

    render(this.#pointsListComponent, this.#pointsListContainer);

    for (let i = 1; i < this.#routePoints.length; i++) {
      const destination = this.#destinations.find((destinationElement) => destinationElement.id === this.#routePoints[i].destination);
      const offersForType = this.#offers.find((offer) => offer.type === this.#routePoints[i].type);

      const checkedOffers = [];
      this.#routePoints[i].offers.forEach((routePointsOfferId) => {
        checkedOffers.push(offersForType.offers.find((offerElement) => offerElement.id === routePointsOfferId));
      });
      this.#renderPoint({point: this.#routePoints[i], destination: destination, offers: checkedOffers});
    }
  }

  #renderPoint({point, destination, offers}) {
    const offersForType = this.#offers.find((offer) => offer.type === point.type);

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
      offers,
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

    render(pointComponent, this.#pointsListComponent.element);
  }
}
