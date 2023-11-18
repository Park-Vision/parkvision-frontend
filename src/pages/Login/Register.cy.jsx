import { getStore } from '../redux/store'
import Register from './Register'

it('User profile should display user name', () => {
  const store = getStore()

  store.dispatch()

  cy.mount(<Register />, { reduxStore: store })

})