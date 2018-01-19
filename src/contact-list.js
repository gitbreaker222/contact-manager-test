import {inject} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator'
import {WebAPI} from './web-api'
import {
  ContactCreated,
  ContactDeleted,
  ContactUpdated,
  ContactViewed,
  ContactNotSelected
} from './messages'

@inject(WebAPI, EventAggregator)
export class ContactList {
  constructor(api, events) {
    this.api = api
    this.contacts = []
    this.selectedId = null

    events.subscribe(ContactViewed, message => this.select(message.contact))
    events.subscribe(ContactNotSelected, message => this.unSelect())
    events.subscribe(ContactCreated, message => this.created(message.contact))
    events.subscribe(ContactDeleted, message => {
      this.deleted(
        message.newCollection,
        message.deletedContact,
      )
    })
    events.subscribe(ContactUpdated, message => {
      let id = message.contact.id
      let found = this.contacts.find(contact => contact.id === id)
      Object.assign(found, message.contact)
    })
  }

  update(collection) {
    this.contacts = collection
  }

  created(contact) {
    this.api.getContactList()
    .then(contacts => {
      this.update(contacts)
      this.select(contact)
    })
  }

  deleted(newCollection, deletedContact) {
    if (this.selectedId === deletedContact.id) {
      this.unSelect()
    }
    this.update(newCollection)
  }

  select(contact) {
    this.selectedId = contact.id
    return true
  }

  unSelect() {
    this.selectedId = null
  }

  isSelected(contactId) {
    return contactId === this.selectedId
  }
}
