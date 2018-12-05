import { bindActionCreators } from 'redux'

import { api, RESTIFY_CONFIG, RestifyForeignKeysArray } from 'redux-restify'

import files from '$trood/files'

import {
  getCreateFormFromServiceActionName,
  getCreateFormFromServiceActionCheckName,
  getModelNameFromFormName,
  getChildEntityName,
  getModelEntitiesName,
  getModelEditorActionsName,
  getAttachMailActionName,
  getAttachMailActionCheckName,
  getModelApiActionsName,
  getAttachedEntityActionName,
} from './constants'

import * as actions from './actions'


export const getEntitiesToGet = (modelName, modelConfig = {}) => {
  const dependsOn = modelConfig.dependsOn || []
  const services = modelConfig.services || []

  // Getting selectors for restify entities selectors
  // TODO by @deylak services should not be treated as model name, we should add serviceManager here
  return (dependsOn.concat(modelName).concat(services)).reduce((memo, model) => ({
    ...memo,
    [model]: (state) => api.selectors.entityManager[model].getEntities(state),
  }), {})
}

export const getCurrentPropsEntities = (currentEntities) => {
  return Object.keys(currentEntities).reduce((memo, key) => ({
    ...memo,
    [getModelEntitiesName(key)]: currentEntities[key],
  }), {})
}

export const getChildEntitiesByModel =
  (modelName, modelConfig = {}, currentEntities, entityId, { childForms = [], model }) => {
    // For child entities let's try to pre-construct array of child entities from childForms
    // If we have edit form of some entity, form will be used, instead of initial restify model
    // Here we create a lazy-getters for child arrays, so we don't trigger any requests
    return Object.keys(currentEntities).reduce((memo, currentModelName) => {
      const currentChildForms = Object.keys(childForms).reduce((memoArray, formName) => {
        if (currentModelName !== getModelNameFromFormName(formName)) {
          return memoArray
        }
        return memoArray.concat(childForms[formName])
      }, [])

      const currentChildModelField = Object.keys(modelConfig.defaults).find(key => {
        const currentDefault = modelConfig.defaults[key]
        return currentDefault instanceof RestifyForeignKeysArray && currentDefault.modelType === currentModelName
      })

      return {
        ...memo,
        [getChildEntityName(currentModelName)]: {
          getChildArray: () => {
            let currentArray = []
            // By checking model type, we define, if the model is form, or restify model
            if (model && !model.$modelType) {
              if (model.id && model[currentChildModelField]) {
                currentArray = model[currentChildModelField]
                  // Filter out temporary forms, while submitting entitites
                  .filter(form => typeof form !== 'object')
                  .map(id => currentEntities[currentModelName].getById(id))
              }
            } else if (model && model[currentChildModelField]) {
              currentArray = model[currentChildModelField]
            }
            // Replace entities with their existing editing forms
            const editedArray = currentArray
              .filter(item => !item.$deleted)
              .map(item => {
                const editChildForm = currentChildForms.find(form => item.id === form.id && form.isSubmitted)
                return editChildForm || item
              })
            return currentChildForms.filter(form => !form.id && form.isSubmitted).concat(editedArray)
          },
          getIsLoadingChildArray: () => {
            if (model && !model.$modelType && model.id && model[currentChildModelField]) {
              return model[currentChildModelField].some(id => currentEntities[currentModelName].getIsLoadingById(id))
            }
            return false
          },
          getChildArrayCount: () => {
            const entities = (model && model[currentChildModelField] ? model[currentChildModelField] : [])
              .filter(item => !item.$deleted)
            const entitiesCount = entities.length
            const formsCount = currentChildForms.filter(form => !form.id && form.isSubmitted)
            return entitiesCount + formsCount
          },
        },
      }
    }, {})
  }

export const getEntitiesActions = (modelName, entitiesToGet, entityId, parents, skipSubmit) => {
  return Object.keys(entitiesToGet).reduce((memo, currentModelName) => ({
    ...memo,
    [currentModelName]: Object.keys(actions).reduce((prevActions, action) => {
      let currentNewParents = []
      // Here we check, if we calculate actions for current model, we don't pass it as parent
      if (currentModelName !== modelName) {
        currentNewParents = {
          modelName,
          id: entityId,
          skipSubmit,
        }
      }
      return {
        ...prevActions,
        [action]: actions[action](currentModelName, (parents || []).concat(currentNewParents)),
      }
    }, {}),
  }), {})
}

export const getCurrentEntitiesActions = (entitiesActions, dispatch) => {
  return Object.keys(entitiesActions).reduce((memo, key) => ({
    ...memo,
    [getModelEditorActionsName(key)]: bindActionCreators(entitiesActions[key], dispatch),
    [getModelApiActionsName(key)]: bindActionCreators(api.actions.entityManager[key], dispatch),
  }), {
    filesActions: bindActionCreators(files.actions, dispatch),
  })
}

export const getModelsForCreateFormFromService = serviceName => {
  const actionName = getCreateFormFromServiceActionName(serviceName)
  const actionCheckName = getCreateFormFromServiceActionCheckName(serviceName)

  const attachMailActionName = getAttachMailActionName('entity')
  const attachMailActionCheckName = getAttachMailActionCheckName('entity')
  const attachedEntityActionName = getAttachedEntityActionName('entity')
  const { registeredModels } = RESTIFY_CONFIG
  return Object.keys(registeredModels).reduce((memo, modelName) => {
    const currentModelActions = registeredModels[modelName].actions || {}
    if (typeof currentModelActions[actionName] === 'function') {
      const currentActionName = getCreateFormFromServiceActionName(serviceName, modelName)
      const currentActionCheckName = getCreateFormFromServiceActionCheckName(serviceName, modelName)

      const currentAttachMailActionName = getAttachMailActionName(modelName)
      const currentAttachMailActionCheckName = getAttachMailActionCheckName(modelName)

      const currentAttachedEntityActionName = getAttachedEntityActionName(modelName)
      return {
        models: memo.models.concat([{
          modelName,
          modelTitle: registeredModels[modelName].name,
          createEntityActionTitle: `Создать ${registeredModels[modelName].name.toLowerCase()}`,
          attachMailActionTitle: `Прикрепить ${registeredModels[modelName].name.toLowerCase()}`,
          createEntityActionName: currentActionName,
          createEntityActionCheckName: currentActionCheckName,
          attachMailActionName: currentAttachMailActionName,
          attachMailActionCheckName: currentAttachMailActionCheckName,
          getAttachedEntityActionName: currentAttachedEntityActionName,
        }]),
        actions: {
          ...memo.actions,
          [currentActionName]: registeredModels[modelName].actions[actionName],
          [currentActionCheckName]: registeredModels[modelName].actions[actionCheckName],
          [currentAttachMailActionName]: registeredModels[modelName].actions[attachMailActionName],
          [currentAttachMailActionCheckName]: registeredModels[modelName].actions[attachMailActionCheckName],
          [currentAttachedEntityActionName]: registeredModels[modelName].actions[attachedEntityActionName],
        },
      }
    }
    return memo
  }, { models: [], actions: [] })
}
