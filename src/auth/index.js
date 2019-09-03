import defaults from 'lodash/defaults'

import * as actions from './actions'
import * as constants from './constants'
import * as selectors from './selectors'
import container from './container'

const {
  TROOD_PERSONAL_ACCOUNT_PAGE_ID,
  TROOD_PERSONAL_ACCOUNT_PAGE_DEFAULT_TITLE,
  TROOD_PERSONAL_ACCOUNT_PAGE_DEFAULT_ICON,
} = constants

import systemConfig from '$trood/config'


export * from './constants'

const getModelIdSelector = () => selectors.getLinkedObjectId
const getModelType = () => systemConfig.services.auth.linkedObject
const getPageConfig = (pageConfig) => {
  const linkedObject = getModelType()
  if (!pageConfig.components && !pageConfig.pages) {
    return defaults(pageConfig, systemConfig.entityPages[linkedObject])
  }
  return pageConfig
}
const getPageContainer = (pageConfig, entityPageName, defaultLayout) => {
  const linkedObject = getModelType()
  const idSelector = getModelIdSelector()
  if (!pageConfig.components && !pageConfig.pages) {
    return defaultLayout.getPageContainer(systemConfig.entityPages[linkedObject], linkedObject, idSelector)
  }
  return defaultLayout.getPageContainer(pageConfig, linkedObject, idSelector)
}
const getPageId = () => TROOD_PERSONAL_ACCOUNT_PAGE_ID
const getPageHeaderRendererConfig = page => ({
  label: page.title || TROOD_PERSONAL_ACCOUNT_PAGE_DEFAULT_TITLE,
  iconType: page.icon || TROOD_PERSONAL_ACCOUNT_PAGE_DEFAULT_ICON,
  localeMessageId: getPageId(),
})

export default {
  actions,
  constants,
  selectors,
  container,
  getPageConfig,
  getPageContainer,
  getPageId,
  getPageHeaderRendererConfig,
  getModelType,
  getModelIdSelector,
}
