import AbstractView from '../framework/view/abstract-view.js';

function createTripTemplate() {
  return (
    `<div>
      <header class="page-header">
        <div class="page-body__container  page-header__container">
          <img class="page-header__logo" src="img/logo.png" width="42" height="42" alt="Trip logo">
          <div class="trip-main">
            <div class="trip-main__trip-controls  trip-controls">
              <div class="trip-controls__filters">
                <h2 class="visually-hidden">Filter events</h2>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main class="page-body__page-main  page-main">
        <div class="page-body__container">
            <section class="trip-events">
              <h2 class="visually-hidden">Trip events</h2>
            </section>
        </div>
      </main>
    </div>`
  );
}

export default class TripView extends AbstractView {

  get template() {
    return createTripTemplate();
  }

  get tripPointsContainer() {
    return this.element.querySelector('.trip-events');
  }

  get tripFiltersContainer() {
    return this.element.querySelector('.trip-controls__filters');
  }

  get tripInfoContainer() {
    return this.element.querySelector('.trip-main');
  }
}
