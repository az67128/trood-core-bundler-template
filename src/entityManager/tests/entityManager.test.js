import {
  store,
  beforeEachFunc,
  registeredBusinessObjects,
} from '$trood/tests/testConfigs'

import * as actions from '../actions'

import {
  getEditModalName,
  getEditFormName,
} from '../constants'


describe('entityManager actions', () => {
  beforeEach(() => beforeEachFunc())

  registeredBusinessObjects.forEach(modelName => {
    it(`can open a modal for creating new ${modelName} entity`, (done) => {
      store.dispatch(actions.editEntity(modelName)())
        .then(({ form }) => {
          const state = store.getState()
          // Modal shown
          expect(state.modals.$modalsCounter).toBe(1)
          expect(state.modals[getEditModalName(modelName)]).toBeDefined()
          // Form created
          expect(state.forms[getEditFormName({ modelName, id: form.tempId })]).toBeDefined()
          done()
        })
        .catch(error => {
          expect(error).toBe(false)
        })
    })
  })
})
