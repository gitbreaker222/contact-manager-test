import {EventAggregator} from 'aurelia-event-aggregator'
import {WebAPI} from './web-api'
import {ContactUpdated, ContactViewed} from './messages'
import {inject} from 'aurelia-framework'

@inject(WebAPI, EventAggregator)
export class ContactList {
  constructor(api, events) {
    this.api = api
    this.contacts = []

    events.subscribe(ContactViewed, message => this.select(message.contact))
    events.subscribe(ContactUpdated, message => {
      let id = message.contact.id
      let found = this.contacts.find(contact => contact.id === id)
      Object.assign(found, message.contact)
    })
  }

  created() {
    this.api.getContactList()
    .then(contacts => this.contacts = contacts)
  }

  select(contact) {
    this.selectedId = contact.id
    return true
  }
}
