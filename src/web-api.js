import {inject} from 'aurelia-framework'
import {EventAggregator} from 'aurelia-event-aggregator'
import {
  ContactCreated,
  ContactDeleted
  //ContactUpdated,
  //ContactViewed
} from './messages'

let latency = 200
let id = 0

function getId() {
  return ++id
}

let contacts = [
  {
    id: getId(),
    firstName: 'John',
    lastName: 'Tolkien',
    email: 'tolkien@inklings.com',
    phoneNumber: '867-5309'
  },
  {
    id: getId(),
    firstName: 'Clive',
    lastName: 'Lewis',
    email: 'lewis@inklings.com',
    phoneNumber: '867-5309'
  },
  {
    id: getId(),
    firstName: 'Owen',
    lastName: 'Barfield',
    email: 'barfield@inklings.com',
    phoneNumber: '867-5309'
  },
  {
    id: getId(),
    firstName: 'Charles',
    lastName: 'Williams',
    email: 'williams@inklings.com',
    phoneNumber: '867-5309'
  },
  {
    id: getId(),
    firstName: 'Roger',
    lastName: 'Green',
    email: 'green@inklings.com',
    phoneNumber: '867-5309'
  }
]

@inject(EventAggregator)
export class WebAPI {
  constructor(events) {
    this.events = events

    events.subscribe(ContactDeleted, message => {
      setTimeout(() => {
        this.offerRestore(message.deletedContact)
      }, 700)
    })
  }

  isRequesting = false;

  getContactList() {
    this.isRequesting = true
    return new Promise(resolve => {
      setTimeout(() => {
        let results = contacts.map(x =>  { return {
          id: x.id,
          firstName: x.firstName,
          lastName: x.lastName,
          email: x.email
        }})
        resolve(results)
        this.isRequesting = false
      }, latency)
    })
  }

  getContactDetails(id) {
    this.isRequesting = true
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let found = contacts.filter(x => x.id == id)[0]
        if (found) {
          resolve(JSON.parse(JSON.stringify(found)))
        } else {
          reject(new Error(id + ': not found'))
        }
        this.isRequesting = false
      }, latency)
    })
  }

  saveContact(contact) {
    this.isRequesting = true
    return new Promise(resolve => {
      setTimeout(() => {
        let instance = JSON.parse(JSON.stringify(contact))
        let found = contacts.filter(x => x.id == contact.id)[0]

        if (found) {
          let index = contacts.indexOf(found)
          contacts[index] = instance
        } else {
          instance.id = getId()
          contacts.push(instance)
        }

        this.isRequesting = false
        //event
        resolve(instance)
      }, latency)
    })
  }

  deleteContact(contact) {
    this.isRequesting = true
    return new Promise(resolve => {
      setTimeout(() => {
        let filteredCollection = contacts.filter(x => x.id !== contact.id)
        contacts = filteredCollection

        this.isRequesting = false

        this.events.publish(new ContactDeleted(filteredCollection, contact))
        resolve(filteredCollection, contact)
      }, latency)
    })
  }

  offerRestore(contact) {
    let result = confirm('Contact deleted. Undo?')

    if (result) {
      this.contact = contact
      this.saveContact(contact)
    }
  }
}
