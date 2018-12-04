import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { api } from 'redux-restify'

import App from './components/App'

import auth from '$trood/auth'

import mailService from '$trood/mailService'


const stateToProps = state => ({
  isHasAuthData: auth.selectors.getIsHasAuthData(state),
  authData: auth.selectors.getAuthData(state),
  permissions: auth.selectors.getPermissions(state),
  authLinkedObject: auth.selectors.getLinkedObject(state),
  isAuthenticated: true || auth.selectors.getIsAuthenticated(state),
  isLoading: api.selectors.loadsManager.getIsLoading(state),
})

const dispatchToProps = (dispatch) => ({
  authActions: bindActionCreators(auth.actions, dispatch),
  mailServiceActions: bindActionCreators(mailService.actions, dispatch),
})

export default withRouter(connect(stateToProps, dispatchToProps)(App))
