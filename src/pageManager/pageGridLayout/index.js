import getPageContainer from './getPageContainer'

import { getPageId, getPageConfig, getModelIdSelector } from '../constants'


const getPageHeaderRendererConfig = (page, entityModelName, layout, prevPageId) => ({
  label: page.title,
  localeMessageId: getPageId(page, entityModelName, layout, prevPageId),
  iconType: page.icon,
})
const getModelType = () => undefined

export default {
  getPageConfig,
  getPageId,
  getPageContainer: (page, entityModelName) =>
    getPageContainer(getPageConfig(page, entityModelName), entityModelName, getModelIdSelector()),
  getPageHeaderRendererConfig,
  getModelType,
  getModelIdSelector,
}
