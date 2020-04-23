import pageGridLayout from './pageGridLayout'
import mailService from '$trood/mailService'
import authService from '$trood/auth'

import { PAGE_TYPES } from './constants'


const pageTypesLayoutsDict = {
  [PAGE_TYPES.grid]: pageGridLayout,
  [PAGE_TYPES.mail]: mailService,
  [PAGE_TYPES.personalAccount]: authService,
}

// Here we getting all page info for rendering it's layout to Trood system
// We have some services, that provide some special pages, that can also be configured in system config
// These services can define their own implementation of headerRenderer and pageContainer,
// so the page will render custom redux container.
// Also these services recieve an instance of default pageGridLayout, so they can inherit it's behaviour
//
// Later this is a possibility for defining full custom user services and pages
export const getPageLayoutProps = (page, entityPageName, prevPageId) => {
  const currentPageService = pageTypesLayoutsDict[page.type]
  const propsArgs = [page, entityPageName, pageGridLayout, prevPageId]
  return {
    pageConfig: pageTypesLayoutsDict[PAGE_TYPES.grid].getPageConfig(...propsArgs),
    // TODO export other only from grid
    id: page.id || currentPageService.getPageId(...propsArgs),
    headerRenderer: currentPageService.getPageHeaderRendererConfig(...propsArgs),
    container: currentPageService.getPageContainer(...propsArgs),
    modelType: currentPageService.getModelType(...propsArgs),
    modelIdSelector: currentPageService.getModelIdSelector(...propsArgs),
  }
}

export const getBasePageTitleArgs = (page, entityPageName) => {
  const currentPageService = pageTypesLayoutsDict[page.type]
  return currentPageService.getPageHeaderRendererConfig(page, entityPageName)
}
