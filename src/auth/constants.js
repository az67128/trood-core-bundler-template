import { ICONS_TYPES } from '$trood/components/TIcon'
import React from 'react'


export const NAME = 'auth'

export const TROOD_PERSONAL_ACCOUNT_PAGE_ID = 'troodPersonalAccount'
export const TROOD_PERSONAL_ACCOUNT_PAGE_DEFAULT_TITLE = 'Личный кабинет'
export const TROOD_PERSONAL_ACCOUNT_PAGE_DEFAULT_ICON = ICONS_TYPES.people

export const LOGIN_PAGE_URL = '/login'
export const RECOVERY_PAGE_URL = '/recovery'

export const PAGE_TYPE_LOGIN = 'login'
export const PAGE_TYPE_RECOVERY = 'recovery'

export const PAGE_TYPE_BY_URL = {
  [LOGIN_PAGE_URL]: {
    type: PAGE_TYPE_LOGIN,
    title: 'Вход',
    formName: 'authForm',
    actionTitle: 'Вход',
    actionName: 'login',
    linkToTitle: 'Забыли пароль?',
    linkTo: RECOVERY_PAGE_URL,
  },
  [RECOVERY_PAGE_URL]: {
    type: PAGE_TYPE_RECOVERY,
    title: 'Восстановление пароля',
    formName: 'recoveryForm',
    actionTitle: 'Отправить',
    actionName: 'recovery',
    linkToTitle: 'Авторизация',
    linkTo: PAGE_TYPE_LOGIN,
  },
}

export const AUTH_MESSAGES = {
  invalid_credentials: 'Некорректные учетные данные',
  'Account not active': 'Аккаунт заблокирован',
  'Recovery link was sent': 'На Ваш E-Mail выслана ссылка для восстановления пароля',
  'Password was changed successfuly': 'Новый пароль успешно установлен',
}

export const defaultAuthManagerContext = {
}

export const AuthManagerContext = React.createContext(defaultAuthManagerContext)
