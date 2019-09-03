import getPageContainer from './getPageContainer'
import * as actions from './actions'

import {
  TROOD_MAIL_SERVICE_PAGE_ID,
  TROOD_MAIL_SERVICE_PAGE_DEFAULT_TITLE,
  TROOD_MAIL_SERVICE_PAGE_DEFAULT_ICON,
} from './constants'


export * from './components'
export * from './constants'


const getModelIdSelector = () => () => undefined
const getPageConfig = page => page
const getPageId = () => TROOD_MAIL_SERVICE_PAGE_ID
const getPageHeaderRendererConfig = page => ({
  label: page.title || TROOD_MAIL_SERVICE_PAGE_DEFAULT_TITLE,
  iconType: page.icon || TROOD_MAIL_SERVICE_PAGE_DEFAULT_ICON,
  localeMessageId: getPageId(),
})
const getModelType = () => undefined

export default {
  actions,
  getPageConfig,
  getPageContainer,
  getPageId,
  getPageHeaderRendererConfig,
  getModelType,
  getModelIdSelector,
}
