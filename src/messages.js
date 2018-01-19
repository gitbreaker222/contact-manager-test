export class ContactCreated {
  constructor(contact) {
    this.contact = contact
  }
}

export class ContactDeleted {
  constructor(newCollection, deletedContact) {
    this.newCollection = newCollection
    this.deletedContact = deletedContact
  }
}

export class ContactUpdated {
  constructor(contact) {
    this.contact = contact
  }
}

export class ContactViewed {
  constructor(contact) {
    this.contact = contact
  }
}

export class ContactNotSelected {
  constructor() {}
}
