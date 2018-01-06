import {inject} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator'
import {ContactNotSelected} from './messages'

@inject(EventAggregator)
export class NoSelection {
  constructor(events) {
    this.message = 'Please Select a Contact.'
    this.events = events
  }

  activate(params, routeConfig) {
    this.events.publish(new ContactNotSelected())
  }
}
