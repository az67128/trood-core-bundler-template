import React from 'react'
import { mount } from 'enzyme'
import jasmineEnzyme from 'jasmine-enzyme'

import {
  history,
  store,
  beforeEachFunc,
  registeredBusinessObjects,
} from '$trood/tests/testConfigs'

import Root from '$trood/Root'

import ClientsTableView from '$trood/componentLibraries/HandymanComponents/ClientsTableView'

describe('App', () => {
  beforeEach(() => {
    jasmineEnzyme()
    beforeEachFunc()
  })

  it('Renders correctly', () => {
    history.push('/clients')
    const wrapper = mount(<Root {...{ store, history }} />)
    const clientsTable = wrapper.find(ClientsTableView)
    expect(clientsTable).toExist()
  })
})
