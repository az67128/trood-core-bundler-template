import uuidV4 from 'uuid/v4'

import { api, forms, RESTIFY_CONFIG } from 'redux-restify'

import modals from '$trood/modals'

import {
  getBaseFormName,
  getEditModalName,
  getViewModalName,
  getEditFormName,
} from './constants'


export const createEntityForm = (modelName, parents = []) => (
  id,
  {
    defaults = {},
    values = {},
    isSubmitted = false,
  } = {},
) => async (dispatch, getState) => {
  const currentModel = RESTIFY_CONFIG.registeredModels[modelName]
  let state = getState()
  const tempId = id || uuidV4()
  const formName = getEditFormName({
    modelName,
    id: tempId,
    parents,
  })

  const oldForm = forms.selectors.getForm(formName)(state)
  const formActions = forms.getFormActions(formName)
  if (oldForm) {
    return {
      formName,
      form: oldForm,
      formActions,
    }
  }

  const newForm = forms.createFormConfig({
    baseConfig: getBaseFormName(modelName),
    model: modelName,
    defaults: {
      ...defaults,
      id,
      tempId,
      isSubmitted,
    },
    values,
    submitExclude: {
      tempId: true,
      isSubmitted: true,
    },
    validateAll: true,
    deleteOnSubmit: true,
  })
  const modelToEdit =
    await api.selectors.entityManager[modelName].getEntities(state).asyncGetById(id, { forceLoad: true })

  dispatch(forms.actions.createForm(formName, newForm, true))

  if (modelToEdit) {
    if (typeof currentModel.actions.mapModelToForm === 'function') {
      dispatch(currentModel.actions.mapModelToForm(modelToEdit, formActions))
    } else {
      dispatch(formActions.applyServerData(modelToEdit))
    }
  }
  state = getState()
  const form = forms.selectors.getForm(formName)(state)
  return {
    formName,
    form,
    formActions,
  }
}

export const createChildForm = createEntityForm

export const viewEntity = (modelName, parents) => (model) => (dispatch) => {
  dispatch(modals.actions.showModal(true, getViewModalName(modelName), {
    entityId: typeof model === 'object' ? model.id : model,
    isEditing: true,
    parents,
  }))
}

/**
 * Start edit entity, shows modal
 * @param {number|string|Object} [model] - can be either restify model, restify form or entity id to edit
 */
const generalEditEntity = (modelName, parents = []) => (model, config = {}) => async (dispatch) => {
  let currentForm
  let idToEdit = model
  let prevForm
  let isEditing = false
  if (typeof model === 'object') {
    // Here we edit already existed, but not sent form, so we should remember it state
    if (model.id) {
      idToEdit = model.id
    } else {
      // TODO by @deylak return actions and name here
      currentForm = {
        form: model,
      }
      prevForm = { ...model }
      isEditing = true
    }
  }
  if (!currentForm) {
    currentForm = await dispatch(createEntityForm(modelName, parents)(idToEdit, config))
  }
  dispatch(modals.actions.showModal(true, getEditModalName(modelName), {
    onSuccess: config.onSuccess,
    entityId: currentForm.form.id || currentForm.form.tempId,
    isEditing: isEditing || !!currentForm.form.id,
    parents,
    prevForm,
  }))
  return currentForm
}

export const editEntity = (modelName) => generalEditEntity(modelName)
export const editChildEntity = generalEditEntity

export const deleteEntity = (modelName, parents = []) => (model) => (dispatch, getState) => {
  return new Promise(async (resolve) => {
    const state = getState()
    let idToDelete
    if (typeof model === 'object') {
      if (model.id) {
        idToDelete = model.id
      }
    } else {
      idToDelete = model
    }
    // Make sure, we have real model here
    const modelObject = await api.selectors.entityManager[modelName].getEntities(state).asyncGetById(idToDelete)

    if (idToDelete) {
      const currentModelConfig = RESTIFY_CONFIG.registeredModels[modelName]
      const currentModelActions = currentModelConfig.actions

      let deleteAction
      if (typeof currentModelActions.deleteEntity === 'function') {
        deleteAction = currentModelActions.deleteEntity(idToDelete, modelObject)
      } else {
        deleteAction = api.actions.entityManager[modelName].deleteById(idToDelete)
      }

      if (currentModelConfig.deletion && currentModelConfig.deletion.confirm) {
        dispatch(modals.actions.showConfirmModal({
          text: currentModelConfig.deletion.message || 'Удалить запись?',
          acceptButtonText: 'Да',
          onAccept: async () => {
            await dispatch(deleteAction)
            resolve()
          },
        }))
      } else {
        await dispatch(deleteAction)
        resolve()
      }
    } else {
      const formName = getEditFormName({
        modelName,
        id: model.tempId,
        parents,
      })
      dispatch(forms.actions.deleteForm(formName))
      resolve()
    }
  })
}
