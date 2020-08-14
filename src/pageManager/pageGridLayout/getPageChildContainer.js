import React from 'react'
import { bindActionCreators } from 'redux'
import { api, forms, RESTIFY_CONFIG } from 'redux-restify'
import memoizeOne from 'memoize-one'

import { applySelectors } from '$trood/helpers/selectors'

import entityManager, {
  getModelEditorActionsName,
  getChildFormRegexp,
  getModelComponentsName,
  getModelActionsName,
  getModelConstantsName,
  getModelEntitiesName,
  getModelApiActionsName,
  getChildEntitiesByModel,
} from '$trood/entityManager'


const getPageChildContainer = (dispatch, getState) => ({
  model = {},
  models = {},
  children,
}) => {
  const currentEntitiesSelectors = applySelectors(`pageContainerCurrentEntities${Math.random()}`)
  const currentEntitiyListsSelectors = applySelectors(`pageContainerEntityLists${Math.random()}`)

  const currentParents = []
  const modelConfig = RESTIFY_CONFIG.registeredModels[model.$modelType]
  if (model.$modelType) {
    currentParents.push({
      modelName: model.$modelType,
      id: model[modelConfig.idField],
      skipSubmit: true,
    })
  }

  const entityListsGetters = {}
  const entitiesToGet = Object.keys(models).reduce((memo, key) => {
    const modelType = models[key]
    const currentModelConfig = RESTIFY_CONFIG.registeredModels[modelType]
    entityListsGetters[key] = api.selectors.entityManager[modelType].getEntities

    const mapedActions = Object.keys(entityManager.actions).reduce((prevActions, action) => ({
      ...prevActions,
      [action]: entityManager.actions[action](modelType, currentParents),
    }), {})
    const apiActions = api.actions.entityManager[modelType]

    return {
      ...memo,
      [getModelEntitiesName(key)]: entityListsGetters[key],
      [getModelComponentsName(key)]: () => currentModelConfig.components,
      [getModelConstantsName(key)]: () => currentModelConfig.constants,

      [getModelEditorActionsName(key)]: () => bindActionCreators(mapedActions, dispatch),
      [getModelActionsName(key)]: () => bindActionCreators(currentModelConfig.actions, dispatch),
      [getModelApiActionsName(key)]: () => bindActionCreators(apiActions, dispatch),
    }
  }, {})

  const state = getState()
  const currentEntities = currentEntitiesSelectors(state, entitiesToGet)

  let childEntitiesByModel = {}
  if (model.$modelType) {
    const currentEntityLists = currentEntitiyListsSelectors(state, entityListsGetters)
    const currentChildFormRegexp = getChildFormRegexp({ parentModel: model.$modelType, parentId: model.id })
    const childForms = forms.selectors.getForm(currentChildFormRegexp)(state)
    childEntitiesByModel =
      getChildEntitiesByModel(model.$modelType, modelConfig, currentEntityLists, model.id, { childForms, model })
  }

  const props = {
    model,
    ...currentEntities,
    ...childEntitiesByModel,
    parents: currentParents,
    PageChildContainer: dispatch(memoizedGetPageChildContainer),
  }

  const childrenArray = Array.isArray(children) ? children : [children]

  return (
    <React.Fragment>
      {
        childrenArray.map((item, i) => {
          if (typeof item === 'function') {
            return item({ ...props, key: i })
          }
          return <item.type key={i} {...item.props} {...props} />
        })
      }
    </React.Fragment>
  )
}

const memoizedGetPageChildContainer = memoizeOne(getPageChildContainer)

export default memoizedGetPageChildContainer
