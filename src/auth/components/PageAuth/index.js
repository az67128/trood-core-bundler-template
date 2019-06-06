import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

import style from './index.css'

import { PAGE_TYPE_RECOVERY, AUTH_MESSAGES } from '../../constants'

import Logo from '$trood/components/Logo'
import TInput, { INPUT_TYPES } from '$trood/components/TInput'
import TButton from '$trood/components/TButton'


class PageAuth extends PureComponent {
  render() {
    const {
      pageType,
      form,
      formErrors,

      formActions = {},
      authActions = {},

      location = {},
    } = this.props

    const isRecovery = pageType.type === PAGE_TYPE_RECOVERY
    const { token } = location.query
    const { nextUrl } = location.state || {}
    const submitAction = () => authActions[pageType.actionName](isRecovery ? token : nextUrl)
    const serverError = (formErrors.data || {}).error
    const serverErrorMessage = AUTH_MESSAGES[serverError] || serverError
    const defaultInputProps = (path) => ({
      key: `${pageType.type}_${path}`,
      value: form[path],
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
          {
            (!isRecovery || !token) &&
            <TInput {...{
              ...defaultInputProps('login'),
              type: INPUT_TYPES.email,
              label: 'Login',
              placeholder: 'Login',
            }} />
          }
          {
            (!isRecovery || token) &&
            <TInput {...{
              ...defaultInputProps('password'),
              type: INPUT_TYPES.password,
              label: 'Password',
              placeholder: 'Password',
            }} />
          }
          {
            isRecovery && token &&
            <TInput {...{
              ...defaultInputProps('passwordConfirmation'),
              type: INPUT_TYPES.password,
              label: 'Verify password',
              placeholder: 'Password',
            }} />
          }
          <div className={style.footer}>
            <TButton {...{
              onClick: submitAction,
              label: pageType.actionTitle,
            }} />
            <div className={style.left}>
              {
                serverErrorMessage &&
                <div className={style.error}>
                  {serverErrorMessage}
                </div>
              }
              {
                /^https?:/.test(pageType.linkTo) &&
                <a className={style.link} href={pageType.linkTo}>
                  {pageType.linkToTitle}
                </a>
                ||
                <Link className={style.link} to={pageType.linkTo}>
                  {pageType.linkToTitle}
                </Link>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default PageAuth
