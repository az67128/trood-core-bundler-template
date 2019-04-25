import getPageContainer from './getPageContainer'


const getModelIdSelector = () => (state, props) => props.match.params.id
const getPageConfig = (page) => page
const getPageId = (page, entityModelName) => `${page.url}${entityModelName ? `_${entityModelName}` : ''}`
const getPageBaseId = (page, entityModelName, layout, prevPageId = '') => {
  return `${prevPageId ? `${prevPageId}_` : ''}${getPageId(page, entityModelName)}`
}
const getPageHeaderRendererConfig = (page, entityModelName, layout, prevPageId) => ({
  label: page.title,
  localeMessageId: getPageBaseId(page, entityModelName, layout, prevPageId),
  iconType: page.icon,
})
const getModelType = () => undefined

// TODO by @deylak make this an interface agreement
// TYPESCRIPT ???!!!
export default {
  getPageConfig,
  getPageId,
  getPageBaseId,
  // So we don't rewrite third gridPageContainer argument
  getPageContainer: (page, entityModelName) => getPageContainer(page, entityModelName, getModelIdSelector()),
  getPageHeaderRendererConfig,
  getModelType,
  getModelIdSelector,
}
