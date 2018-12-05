import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { forms, api, RESTIFY_CONFIG } from 'redux-restify'

import entityManager from '$trood/entityManager'

import PageMail from './components/PageMail'

import files from '$trood/files'

import * as actions from './actions'
import { SERVICE_NAME, FOLDER_INBOX } from './constants'


const getPageContainer = () => {
  const modelsForCreateFormFromService = entityManager.selectors.getModelsForCreateFormFromService(SERVICE_NAME)

  const stateToProps = (state, props) => {
    const mailServiceConfigForm = forms.selectors.mailServiceConfigForm.getForm(state)
    const foldersEntities = api.selectors.entityManager.folders.getEntities(state)

    const chainsEntities = api.selectors.entityManager.chains.getEntities(state)
    const selectedFolder = props.location.query.folder
    const chainsApiConfig = {
      filter: {
        search: mailServiceConfigForm.chainActualSearch,
        folder: selectedFolder || FOLDER_INBOX,
        ordering: '-last',
      },
    }

    const mailsEntities = api.selectors.entityManager.mails.getEntities(state)
    return {
      ...props,

      folders: foldersEntities.getArray(),
      foldersIsLoading: foldersEntities.getIsLoadingArray(),

      chainId: props.location.query.chain,
      chainsApiConfig,
      chainsEntities,

      mailsEntities,

      modelsForCreateFormFromService: modelsForCreateFormFromService.models,

      mailServiceConfigForm,
    }
  }

  const dispatchToProps = dispatch => {
    return {
      chainsApiActions: bindActionCreators(api.actions.entityManager.chains, dispatch),
      mailsApiActions: bindActionCreators(api.actions.entityManager.mails, dispatch),
      filesActions: bindActionCreators(files.actions, dispatch),
      mailServiceActions: bindActionCreators(actions, dispatch),
      mailServiceConfigFormActions: bindActionCreators(forms.actions.mailServiceConfigForm, dispatch),

      actionsForCreateFormFromService: bindActionCreators(modelsForCreateFormFromService.actions, dispatch),
      dispatch,
    }
  }

  const mergeProps = (stateProps, dispatchProps) => {
    const createFormFromEntitiesActions = modelsForCreateFormFromService.models.reduce((memo, curr) => {
      const currentModel = RESTIFY_CONFIG.registeredModels[curr.modelName]
      const entitiesToGet = entityManager.selectors.getEntitiesToGet(curr.modelName, currentModel)
      const entitiesActions = entityManager.selectors.getEntitiesActions(
        curr.modelName,
        entitiesToGet,
        stateProps.entityId,
        stateProps.parents,
      )
      return {
        ...memo,
        [curr.modelName]: entityManager.selectors.getCurrentEntitiesActions(entitiesActions, dispatchProps.dispatch),
      }
    }, {})
    return {
      ...stateProps,
      ...dispatchProps,
      createFormFromEntitiesActions,
    }
  }

  return withRouter(connect(stateToProps, dispatchToProps, mergeProps)(PageMail))
}

export default getPageContainer
