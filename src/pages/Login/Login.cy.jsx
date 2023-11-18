import React from 'react'
import Login from './Login'

describe('<Login />', () => {
  it('renders', () => {

    cy.mount(<Login />)
  })
})