import EventsListView from '../view/events-list-view.js';
import EventTripView from '../view/event-trip-view.js';
import EditEventView from '../view/edit-event-view.js';
import { render } from '../render.js';

export default class EventsListPresenter {
  eventsListComponent = new EventsListView();

  constructor(eventsListContainer) {
    this.eventsListContainer = eventsListContainer;
  }

  init() {
    render(this.eventsListComponent, this.eventsListContainer);
    render(new EditEventView(), this.eventsListComponent.getElement());
    for (let i = 0; i < 3; i++) {
      render(new EventTripView(), this.eventsListComponent.getElement());
    }
  }
}
