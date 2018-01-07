import {inject} from 'aurelia-framework'
import {WebAPI} from './web-api'
import {Router} from 'aurelia-router'
import {EventAggregator} from 'aurelia-event-aggregator'
import {
  ContactCreated,
  ContactUpdated,
  ContactViewed
} from './messages'
import {areEqual} from './utility'

@inject(WebAPI, EventAggregator, Router)
export class ContactDetail {
  constructor(api, events, router) {
    this.api = api
    this.events = events
    this.router = router

    this.originalContact = {}
    this.contact = {}
  }

  activate(params, routeConfig) {
    this.routeConfig = routeConfig

    if (params.id) {
      return this.api.getContactDetails(params.id)
      .then(contact => {
        this.contact = contact
        this.routeConfig.navModel.setTitle(contact.firstName)
        this.originalContact = JSON.parse(JSON.stringify(contact))
        this.events.publish(new ContactViewed(this.contact))
      })
      .catch(error => {
        console.error(error)
        this.router.navigateToRoute('home')
      })
    }

    this.contact = {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: ''
    }
    this.originalContact = JSON.parse(JSON.stringify(this.contact))
  }

  get canSave() {
    return this.contact.firstName
      && this.contact.lastName
      && !this.api.isRequesting
  }

  save() {
    let isNew = !this.contact.id

    this.api.saveContact(this.contact)
    .then(contact => {
      this.contact = contact
      this.routeConfig.navModel.setTitle(contact.firstName)
      this.originalContact = JSON.parse(JSON.stringify(contact))
      if (isNew) {
        this.events.publish(new ContactCreated(this.contact))
        this.router.navigateToRoute('contacts', { id: this.contact.id })
      } else {
        this.events.publish(new ContactUpdated(this.contact))
      }
    })
  }

  canDeactivate() {
    if (!areEqual(this.originalContact, this.contact)) {
      let result = confirm('You have unsaved changes. Are you sure you wish to leave?')

      if (!result) {
        this.events.publish(new ContactViewed(this.contact))
      }

      return result
    }

    return true
  }
}
