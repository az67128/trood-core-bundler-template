import React from 'react'
import { Link } from 'react-router-dom'

import style from './index.css'

import { PAGE_TYPE_RECOVERY, AUTH_MESSAGES } from '../../constants'

import Logo from '$trood/components/Logo'
import TInput, { INPUT_TYPES } from '$trood/components/TInput'
import TButton from '$trood/components/TButton'


const PageAuth = ({
  pageType,
  form,
  formErrors,

  formActions = {},
  authActions = {},

  location = {},
}) => {
  const isRecovery = pageType.type === PAGE_TYPE_RECOVERY
  const { token } = location.query
  const { nextUrl } = location.state || {}
  const submitAction = () => authActions[pageType.actionName](isRecovery ? token : nextUrl)
  const serverError = (formErrors.data || {}).error
  const serverErrorMessage = AUTH_MESSAGES[serverError] || serverError
  const defaultInputProps = (path) => ({
    key: `${pageType.type}_${path}`,
    defaultValue: form[path],
    replaceValue: form[path],
    className: style.input,
    onChange: value => formActions.changeField(path, value),
    onInvalid: errs => formActions.setFieldError(path, errs),
    onValid: () => formActions.resetFieldError(path),
    onEnter: submitAction,
    errors: formErrors[path],
    validate: {
      checkOnBlur: true,
      required: true,
    },
  })
  return (
    <div className={style.root}>
      <div className={style.form}>
        <div className={style.title}>
          {pageType.title}
          <Logo size={80} />
        </div>
        {(!isRecovery || !token) &&
          <TInput {...{
            ...defaultInputProps('login'),
            type: INPUT_TYPES.email,
            label: 'Почта',
            placeholder: 'Ваша почта',
          }} />
        }
        {(!isRecovery || token) &&
          <TInput {...{
            ...defaultInputProps('password'),
            type: INPUT_TYPES.password,
            label: 'Пароль',
            placeholder: 'Ваш пароль',
          }} />
        }
        {isRecovery && token &&
          <TInput {...{
            ...defaultInputProps('passwordConfirmation'),
            type: INPUT_TYPES.password,
            label: 'Подтверждение пароля',
            placeholder: 'Ваш пароль',
          }} />
        }
        <div className={style.footer}>
          <TButton {...{
            onClick: submitAction,
            label: pageType.actionTitle,
          }} />
          <div className={style.left}>
            {serverErrorMessage &&
              <div className={style.error}>
                {serverErrorMessage}
              </div>
            }
            <Link className={style.link} to={pageType.linkTo}>
              {pageType.linkToTitle}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PageAuth
