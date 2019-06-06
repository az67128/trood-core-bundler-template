import { ICONS_TYPES } from '$trood/components/TIcon'
import React from 'react'


export const NAME = 'auth'

export const TROOD_PERSONAL_ACCOUNT_PAGE_ID = 'troodPersonalAccount'
export const TROOD_PERSONAL_ACCOUNT_PAGE_DEFAULT_TITLE = 'Personal account'
export const TROOD_PERSONAL_ACCOUNT_PAGE_DEFAULT_ICON = ICONS_TYPES.people

export const LOGIN_PAGE_URL = '/login'
export const RECOVERY_PAGE_URL = '/recovery'

export const PAGE_TYPE_LOGIN = 'login'
export const PAGE_TYPE_RECOVERY = 'recovery'

export const PAGE_TYPE_BY_URL = {
  [LOGIN_PAGE_URL]: {
    type: PAGE_TYPE_LOGIN,
    title: 'Authorization',
    formName: 'authForm',
    actionTitle: 'Login',
    actionName: 'login',
    linkToTitle: 'Forgot password?',
    linkTo: RECOVERY_PAGE_URL,
  },
  [RECOVERY_PAGE_URL]: {
    type: PAGE_TYPE_RECOVERY,
    title: 'Password recovery',
    formName: 'recoveryForm',
    actionTitle: 'Send',
    actionName: 'recovery',
    linkToTitle: 'Login',
    linkTo: PAGE_TYPE_LOGIN,
  },
}

export const AUTH_MESSAGES = {
  invalid_credentials: 'Invalid credentials',
  'Account not active': 'Account was blocked',
  'Recovery link was sent': 'Password recovery link sent to your email',
  'Password was changed successfuly': 'Password was changed successfully',
}

export const defaultAuthManagerContext = {
}

export const AuthManagerContext = React.createContext(defaultAuthManagerContext)
