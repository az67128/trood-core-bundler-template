import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import style from './index.css'

import TButton, { BUTTON_SPECIAL_TYPES, BUTTON_COLORS } from '$trood/components/TButton'
import TInput, { INPUT_TYPES } from '$trood/components/TInput'
import TIcon, { ICONS_TYPES } from '$trood/components/TIcon'
import TSelect from '$trood/components/TSelect'
import TCheckbox from '$trood/components/TCheckbox'
import { ENCRYPTION_TYPES } from '../../constants'

import { getNestedObjectField } from '$trood/helpers/nestedObjects'

class MailboxesSettingsMailService extends PureComponent {
  static propTypes = {
    className: PropTypes.string,

    mailboxes: PropTypes.arrayOf(PropTypes.object),
    mailboxesApiActions: PropTypes.object,
    editMailboxesFormActions: PropTypes.object,
    editMailboxesFormErrors: PropTypes.object,
    editMailboxesFormValid: PropTypes.bool,

    mailServiceActions: PropTypes.object,
  }

  static defaultProps = {
    className: '',

    mailboxes: [],
    mailboxesApiActions: {},
    editMailboxesFormActions: {},

    mailServiceActions: {},
  }

  render() {
    const {
      className,

      mailboxes,
      editMailboxesForm,
      mailboxesApiActions,
      editMailboxesFormActions,
      editMailboxesFormErrors,
      editMailboxesFormValid,

      mailServiceActions,
    } = this.props

    const getFormChangeInputProps = (name) => ({
      className: style.control,
      labelClassName: style.label,
      defaultValue: getNestedObjectField(editMailboxesForm, name),
      replaceValue: getNestedObjectField(editMailboxesForm, name),
      onChange: value => editMailboxesFormActions.changeField(name, value),
      onInvalid: errs => editMailboxesFormActions.setFieldError(name, errs),
      onValid: () => editMailboxesFormActions.resetFieldError(name),
      errors: getNestedObjectField(editMailboxesFormErrors, name),
      validate: {
        required: true,
        checkOnBlur: true,
      },
    })

    const getFormChangeSelectProps = (name) => ({
      className: style.selectBlock,
      placeHolder: 'Не выбрано',
      replaceSelectValues: editMailboxesForm[name] && [editMailboxesForm[name]],
      items: Object.keys(ENCRYPTION_TYPES).map(item => ({ value: item, label: item })),
      onInvalid: errs => editMailboxesFormActions.setFieldError(name, errs),
      onValid: () => editMailboxesFormActions.resetFieldError(name),
      onChange: value => editMailboxesFormActions.changeField(name, value[0]),
      errors: getNestedObjectField(editMailboxesFormErrors, name),
      validate: {
        required: true,
        checkOnBlur: true,
      },
    })

    const nonFieldErrors = (editMailboxesFormErrors.nonFieldErrors || []).map((item, key) => (
      <div {...{
        className: style.error,
        key,
      }}>
        {item}
      </div>
    ))

    return (
      <div {...{
        className: classNames(style.root, className),
      }} >
        {!editMailboxesForm && mailboxes.map(mailbox => (
          <div {...{
            key: mailbox.id,
            className: style.mailboxes,
          }}>
            <div {...{
              className: style.mailboxesName,
              onClick: () => {
                mailServiceActions.createMailboxesForm(mailbox.id)
              },
            }}>
              {mailbox.name} - {mailbox.email}
            </div>
            <TIcon {...{
              className: style.delete,
              type: ICONS_TYPES.trashBin,
              size: 16,
              onClick: () => mailboxesApiActions.deleteById(mailbox.id),
            }} />
          </div>
        ))}
        {!editMailboxesForm &&
          <TButton {...{
            className: style.buttonAdd,
            onClick: () => {
              mailServiceActions.createMailboxesForm()
            },
            label: 'Почта',
            specialType: BUTTON_SPECIAL_TYPES.add,
          }} />
        }
        {editMailboxesForm &&
          <div {...{
            className: style.mailboxesAdd,
          }} >
            <TInput {...{
              label: 'Название',
              ...getFormChangeInputProps('name'),
            }} />
            <TInput {...{
              label: 'Email',
              ...getFormChangeInputProps('email'),
              type: INPUT_TYPES.email,
            }} />
            <TInput {...{
              label: 'Password',
              ...getFormChangeInputProps('password'),
              type: INPUT_TYPES.password,
            }} />
            <TInput {...{
              label: 'Imap Host',
              ...getFormChangeInputProps('imapHost'),
            }} />
            <TInput {...{
              label: 'Imap Port',
              ...getFormChangeInputProps('imapPort'),
              type: INPUT_TYPES.number,
            }} />
            <TSelect {...{
              ...getFormChangeSelectProps('imapSecure'),
              label: 'Imap Secure',
            }} />
            <TInput {...{
              label: 'Smtp Host',
              ...getFormChangeInputProps('smtpHost'),
            }} />
            <TInput {...{
              label: 'Smtp Port',
              ...getFormChangeInputProps('smtpPort'),
              type: INPUT_TYPES.number,
            }} />
            <TSelect {...{
              ...getFormChangeSelectProps('smtpSecure'),
              label: 'Smtp Secure',
            }} />
            <TCheckbox {...{
              value: getNestedObjectField(editMailboxesForm, 'shared'),
              onChange: value => editMailboxesFormActions.changeField('shared', value),
              label: 'Показать всем',
            }} />
            {nonFieldErrors}
            <div {...{
              className: style.buttonWrap,
            }} >
              <TButton {...{
                className: style.buttonAdd,
                onClick: editMailboxesFormActions.submit,
                label: editMailboxesForm.id ? 'Изменить' : 'Добавить',
                disabled: !editMailboxesFormValid,
              }} />
              <TButton {...{
                className: style.buttonCancel,
                label: 'Отменить',
                color: BUTTON_COLORS.gray,
                onClick: editMailboxesFormActions.deleteForm,
              }} />
            </div>
          </div>
        }
      </div>
    )
  }
}

export default MailboxesSettingsMailService
