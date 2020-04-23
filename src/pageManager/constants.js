import React from 'react'

import auth from '$trood/auth'
import mailService, { TROOD_MAIL_SERVICE_PAGE_DEFAULT_TITLE } from '$trood/mailService'
import { snakeToCamel } from '$trood/helpers/namingNotation'


const getComponentId = (type, index, prefix = '') => {
  return `${type.replace('/', '_')}_${index}${prefix && '_'}${prefix}`
}
const getPageComponentId = (pageId, compId) => {
  return snakeToCamel(`${compId}_${pageId}`)
}
const getPageComponents = (pageId, comp, compPrefix) => {
  if (!comp.components) return undefined
  return comp.components.map((c, index) => {
    const id = getComponentId(c.type, index, compPrefix)
    return {
      ...c,
      id: getPageComponentId(pageId, id),
      components: getPageComponents(pageId, c, id),
    }
  })
}

export const PAGE_TYPE_GRID = 'grid'
export const PAGE_TYPE_MAIL = 'mail'
export const PAGE_TYPE_PERSONAL_ACCOUNT = 'personalAccount'

export const getPageIdSub = (page, entityModelName) => `${page.url}${entityModelName ? `_${entityModelName}` : ''}`
export const getPageId = (page, entityModelName, layout, prevPageId = '') => {
  let isParentPageIdAndedModelName = true
  if (entityModelName && prevPageId) {
    const modelName = entityModelName.toLowerCase()
    const pageId = prevPageId.toLowerCase()
    isParentPageIdAndedModelName = pageId.lastIndexOf(modelName) === pageId.length - modelName.length
  }

  return snakeToCamel(`${prevPageId ? `${prevPageId}_` : ''}${
    getPageIdSub(page, isParentPageIdAndedModelName ? entityModelName : undefined)}`)
}

export const getModelIdSelector = () => (state, props) => props.match.params.id
const getGridPageConfig = (page, ...args) => {
  const pageId = page.id || getPageId(page, ...args)
  return {
    ...page,
    id: pageId,
    components: getPageComponents(pageId, page),
    pages: page.pages && page.pages.map(p => getGridPageConfig(p, args[0], args[1], pageId)),
  }
}

export const PAGE_TYPES = {
  [PAGE_TYPE_GRID]: PAGE_TYPE_GRID,
  [PAGE_TYPE_MAIL]: PAGE_TYPE_MAIL,
  [PAGE_TYPE_PERSONAL_ACCOUNT]: PAGE_TYPE_PERSONAL_ACCOUNT,
}

export const PAGE_TYPES_DEFAULT_TITLE = {
  [PAGE_TYPE_MAIL]: TROOD_MAIL_SERVICE_PAGE_DEFAULT_TITLE,
  [PAGE_TYPE_PERSONAL_ACCOUNT]: auth.constants.TROOD_PERSONAL_ACCOUNT_PAGE_DEFAULT_TITLE,
}

export const PAGE_TYPES_GET_PAGE_ID = {
  [PAGE_TYPE_GRID]: getPageId,
  [PAGE_TYPE_MAIL]: mailService.getPageId,
  [PAGE_TYPE_PERSONAL_ACCOUNT]: auth.getPageId,
}

export const PAGE_TYPES_GET_PAGE_CONFIG = {
  [PAGE_TYPE_GRID]: getGridPageConfig,
  [PAGE_TYPE_MAIL]: (p, ...args) => getGridPageConfig(mailService.getPageConfig(p, ...args), ...args),
  [PAGE_TYPE_PERSONAL_ACCOUNT]: (p, ...args) => getGridPageConfig(auth.getPageConfig(p, ...args), ...args),
}

export const getPageConfig = (page, ...args) => {
  return PAGE_TYPES_GET_PAGE_CONFIG[page.type](page, ...args)
}

export const NAME = 'pageManager'

export const defaultPageManagerContext = {
  match: {
    params: {},
    isExact: false,
    path: '/',
    url: '/',
  },
  basePath: [],
  registeredRoutesPaths: [],
}

export const PageManagerContext = React.createContext(defaultPageManagerContext)
