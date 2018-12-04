import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import urlSchema, { getBaseUrl } from '../../urlSchema'

import { PageManagerContext, defaultPageManagerContext } from '../../constants'

import { getNestedObjectField } from '$trood/helpers/nestedObjects'

import NotFound from '$trood/components/NotFound'


const extraSlashRegex = /\/\/+/g

const RouteSchema = ({
  prevMatch,

  basePath = [],
  renderers = {},
  registeredRoutesPaths,
}) => {
  const currentBaseUrl = getNestedObjectField(urlSchema, basePath)
  const mappedRoutes = Object.keys(renderers).map(key => {
    const currentRenderer = getNestedObjectField(renderers, key) || renderers[key[key.length - 1]]
    if (!currentRenderer) return null
    const CurrentComponent = currentRenderer.component
    let currentPath = `/${getBaseUrl(getNestedObjectField(currentBaseUrl, key))}`
    let currentUrl = currentPath
    if (prevMatch) {
      currentPath = (prevMatch.path === '/' ? '' : prevMatch.path) + currentPath
      currentUrl = (prevMatch.url === '/' ? '' : prevMatch.url) + currentUrl
    }

    // Prevent cases, when user inputs extra slash at the end of url
    currentPath = currentPath.replace(extraSlashRegex, '/')
    currentUrl = currentUrl.replace(extraSlashRegex, '/')

    return {
      key,
      currentPath,
      currentUrl,
      CurrentComponent,
      currentRenderer,
    }
  }).filter(v => v)

  const redirectRoute = mappedRoutes.find(route => !route.currentRenderer.isExtra)
  return (
    <Switch>
      {redirectRoute &&
        <Redirect {...{
          push: false,
          exact: true,
          from: prevMatch.path,
          // TODO by @deylak add redirect configuration logic
          to: redirectRoute.currentUrl,
        }} />
      }
      {mappedRoutes.map(({
        key,
        currentPath,
        CurrentComponent,
        currentRenderer,
      }) => {
        // TODO by @deylak here we cause rerenders, cause of creating new object for context.
        // But this component really not rerenders itself, so this should be ok for now
        return (
          <Route {...{
            key,
            path: currentPath,
            render: ({ match }) => {
              return (
                <PageManagerContext.Provider value={{
                  ...defaultPageManagerContext,
                  match,
                  registeredRoutesPaths,
                  basePath: basePath.concat(key),
                }}>
                  <CurrentComponent {...currentRenderer.props} />
                </PageManagerContext.Provider>
              )
            },
          }} />
        )
      })}
      <Route component={NotFound} />
    </Switch>
  )
}

export default RouteSchema
