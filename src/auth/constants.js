import { ICONS_TYPES } from '$trood/components/TIcon'
import React from 'react'
import { defineMessages } from 'react-intl'


export const NAME = 'auth'

export const TROOD_PERSONAL_ACCOUNT_PAGE_ID = 'troodPersonalAccount'
export const TROOD_PERSONAL_ACCOUNT_PAGE_DEFAULT_TITLE = 'Personal account'
export const TROOD_PERSONAL_ACCOUNT_PAGE_DEFAULT_ICON = ICONS_TYPES.people

export const LOGIN_PAGE_URL = '/login'
export const RECOVERY_PAGE_URL = '/recovery'

export const PAGE_TYPE_LOGIN = 'login'
export const PAGE_TYPE_RECOVERY = 'recovery'

export const messages = defineMessages({
  auth: {
    id: 'auth.authorization',
    defaultMessage: 'Authorization',
  },
  login: {
    id: 'auth.login',
    defaultMessage: 'Login',
  },
  password: {
    id: 'auth.password',
    defaultMessage: 'Password',
  },
  verifyPassword: {
    id: 'auth.verify_password',
    defaultMessage: 'Verify password',
  },
  loginButton: {
    id: 'auth.login_button',
    defaultMessage: 'Login',
  },
  forgot: {
    id: 'auth.forgot',
    defaultMessage: 'Forgot password?',
  },
  recovery: {
    id: 'auth.recovery',
    defaultMessage: 'Password recovery',
  },
  send: {
    id: 'auth.send',
    defaultMessage: 'Send',
  },
  error: {
    id: 'auth.error',
    defaultMessage: 'Error!',
  },
  notFound: {
    id: 'auth.account_not_found',
    defaultMessage: 'Account not found',
  },
  invalid_credentials: {
    id: 'auth.invalid_credentials',
    defaultMessage: 'Invalid credentials',
  },
  'Account not active': {
    id: 'auth.account_not_active',
    defaultMessage: 'Account was blocked',
  },
  'Recovery link was sent': {
    id: 'auth.recovery_link',
    defaultMessage: 'Password recovery link sent to your email',
  },
  'Password was changed successfuly': {
    id: 'auth.password_was_changed',
    defaultMessage: 'Password was changed successfully',
  },
})

export const PAGE_TYPE_BY_URL = {
  [LOGIN_PAGE_URL]: {
    type: PAGE_TYPE_LOGIN,
    title: messages.auth,
    formName: 'authForm',
    actionTitle: messages.loginButton,
    actionName: 'login',
    linkToTitle: messages.forgot,
    linkTo: RECOVERY_PAGE_URL,
  },
  [RECOVERY_PAGE_URL]: {
    type: PAGE_TYPE_RECOVERY,
    title: messages.recovery,
    formName: 'recoveryForm',
    actionTitle: messages.send,
    actionName: 'recovery',
    linkToTitle: messages.loginButton,
    linkTo: PAGE_TYPE_LOGIN,
  },
}

export const defaultAuthManagerContext = {}

export const AuthManagerContext = React.createContext(defaultAuthManagerContext)
