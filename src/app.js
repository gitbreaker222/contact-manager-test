import {inject} from 'aurelia-framework'
import {WebAPI} from './web-api'

@inject(WebAPI)
export class App {
  constructor(api) {
    this.api = api
  }

  configureRouter(config, router) {
    config.title = 'Contacts'
    config.map([
      {
        route: ['', 'home'],
        moduleId: 'no-selection',
        name: 'home',
        title: 'Select'
      },
      {
        route: 'contacts/create',
        moduleId: 'contact-detail',
        name: 'contactCreate',
        title: 'Create'
      },
      {
        route: 'contacts/:id',
        moduleId: 'contact-detail',
        name: 'contacts'
      }
    ])

    config.fallbackRoute('home')

    this.router = router
  }
}
