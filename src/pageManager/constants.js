import React from 'react'


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
