import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import memoizeOne from 'memoize-one'

import style from './index.css'

import modals from '$trood/modals'
import auth, { AuthManagerContext, LOGIN_PAGE_URL, RECOVERY_PAGE_URL } from '$trood/auth'

import Header from '../Header'
import PageHeader from '../PageHeader'

import systemConfig from '$trood/config'

import {
  RouteSchema,
  PageManagerContext,
  defaultPageManagerContext,
  getPagesRouteShemaRenderers,
  getAllPaths,
} from '$trood/pageManager'

import { DEFAULT_SCROLLING_CONTAINER_ID } from '$trood/mainConstants'

import { MailServiceContext } from '$trood/mailService'


const getRenderers = (sbj, permissions = {}) => {
  return getPagesRouteShemaRenderers(
    systemConfig.pages,
    {
      extraPages: systemConfig.entityPages,
    },
    {
      sbj,
      rules: permissions.frontend,
    },
  )
}

const getPageManagerContext = registeredRoutesPaths => ({
  ...defaultPageManagerContext,
  registeredRoutesPaths,
})

const memoizedGetRenderers = memoizeOne(getRenderers)
const memoizedGetAllPaths = memoizeOne(getAllPaths)
const memoizedGetPageManagerContext = memoizeOne(getPageManagerContext)

class App extends Component {
  static propTypes = {
    authLinkedObject: PropTypes.object,
    permissions: PropTypes.object,
  }

  static defaultProps = {
    authLinkedObject: {},
    permissions: {},
  }

  constructor(props) {
    super(props)

    const {
      mailServiceActions,
    } = this.props

    this.mailServiceContext = {
      mailServiceActions,
    }

    this.restoreAuthData = this.restoreAuthData.bind(this)
  }

  componentDidMount() {
    this.restoreAuthData()
  }

  componentDidUpdate() {
    this.restoreAuthData()
  }

  restoreAuthData() {
    const {
      isLoading,
      isAuthenticated,
      isHasAuthData,
      authActions,
    } = this.props
    if (!isLoading && isAuthenticated && !isHasAuthData) {
      authActions.restoreAuthData()
    }
  }

  render() {
    const {
      isAuthenticated,
      authLinkedObject,
      permissions,

      authData = {},
      authActions = {},

      match,
    } = this.props

    // TODO restify getById memoized; authLinkedObject changed on every render
    const renderers = memoizedGetRenderers(authLinkedObject, permissions)
    const registeredRoutesPaths = memoizedGetAllPaths(renderers)
    const pageManagerContextValue = memoizedGetPageManagerContext(registeredRoutesPaths)

    return (
      <AuthManagerContext.Provider value={authData}>
        <PageManagerContext.Provider value={pageManagerContextValue}>
          <MailServiceContext.Provider value={this.mailServiceContext}>
            <div className={style.root}>
              {React.createElement(modals.container)}
              {!isAuthenticated &&
                <Switch>
                  <Route {...{
                    path: LOGIN_PAGE_URL,
                    component: auth.container,
                  }} />
                  <Route {...{
                    path: RECOVERY_PAGE_URL,
                    component: auth.container,
                  }} />
                  <Route {...{
                    render: ({ location }) => (
                      <Redirect {...{
                        to: {
                          pathname: LOGIN_PAGE_URL,
                          state: {
                            nextUrl: location.pathname,
                          },
                        },
                      }} />
                    ),
                  }} />
                </Switch>
              }
              {isAuthenticated &&
                <React.Fragment>
                  <Route {...{
                    path: LOGIN_PAGE_URL,
                    render: () => <Redirect to="/" />,
                  }} />
                  <Route {...{
                    path: RECOVERY_PAGE_URL,
                    render: () => <Redirect to="/" />,
                  }} />
                  <Header {...{
                    authActions,
                  }} />
                  <div id={DEFAULT_SCROLLING_CONTAINER_ID} className={style.components}>
                    <PageHeader />
                    <RouteSchema {...{
                      renderers,
                      registeredRoutesPaths,
                      prevMatch: match,
                    }} />
                  </div>
                </React.Fragment>
              }
            </div>
          </MailServiceContext.Provider>
        </PageManagerContext.Provider>
      </AuthManagerContext.Provider>
    )
  }
}

export default App
