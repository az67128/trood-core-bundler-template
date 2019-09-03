import React from 'react'

import auth from '$trood/auth'
import mailService, { TROOD_MAIL_SERVICE_PAGE_DEFAULT_TITLE } from '$trood/mailService'

export const PAGE_TYPE_GRID = 'grid'
export const PAGE_TYPE_MAIL = 'mail'
export const PAGE_TYPE_PERSONAL_ACCOUNT = 'personalAccount'

export const getModelIdSelector = () => (state, props) => props.match.params.id
export const getPageConfig = (page) => page
export const getPageId = (page, entityModelName) => `${page.url}${entityModelName ? `_${entityModelName}` : ''}`
export const getPageBaseId = (page, entityModelName, layout, prevPageId = '') => {
  return `${prevPageId ? `${prevPageId}_` : ''}${getPageId(page, entityModelName)}`
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
