import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import classNames from 'classnames'

import style from './index.css'

import TButton, { BUTTON_SPECIAL_TYPES, BUTTON_COLORS } from '$trood/components/TButton'
import TInput, { INPUT_TYPES } from '$trood/components/TInput'
import TIcon, { ICONS_TYPES } from '$trood/components/TIcon'
import TSelect from '$trood/components/TSelect'
import TCheckbox from '$trood/components/TCheckbox'
import { ENCRYPTION_TYPES, messages } from '../../constants'
import localeService, { intlObject } from '$trood/localeService'

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

    if (editMailboxesFormErrors) {
      Object.keys(editMailboxesFormErrors).forEach(field => {
        editMailboxesFormErrors[field] = (editMailboxesFormErrors[field])
          .map(error => {
            const msg = messages[error]
            if (!msg) return error
            return intlObject.intl.formatMessage(msg)
          })
      })
    }

    const getFormChangeInputProps = (name) => ({
      className: style.control,
      labelClassName: style.label,
      value: getNestedObjectField(editMailboxesForm, name),
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
      placeHolder: intlObject.intl.formatMessage(localeService.generalMessages.notSet),
      values: editMailboxesForm[name] && [editMailboxesForm[name]],
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

    const nonFieldErrors = (editMailboxesFormErrors.nonFieldErrors || []).map((item, key) => {
      const msg = messages[item]
      return (
        <div {...{
          className: style.error,
          key,
        }}>
          {msg ? intlObject.intl.formatMessage(msg) : msg}
        </div>
      )
    })

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
            label: intlObject.intl.formatMessage(messages.mailBox),
            specialType: BUTTON_SPECIAL_TYPES.add,
          }} />
        }
        {editMailboxesForm &&
          <div {...{
            className: style.mailboxesAdd,
          }} >
            <TInput {...{
              ...getFormChangeInputProps('name'),
              label: intlObject.intl.formatMessage(messages.mailBoxName),
            }} />
            <TInput {...{
              ...getFormChangeInputProps('email'),
              label: intlObject.intl.formatMessage(messages.email),
              type: INPUT_TYPES.email,
            }} />
            <TInput {...{
              ...getFormChangeInputProps('password'),
              label: intlObject.intl.formatMessage(messages.password),
              type: INPUT_TYPES.password,
            }} />
            <TInput {...{
              ...getFormChangeInputProps('imapHost'),
              label: intlObject.intl.formatMessage(messages.imapHost),
            }} />
            <TInput {...{
              ...getFormChangeInputProps('imapPort'),
              label: intlObject.intl.formatMessage(messages.imapPort),
              type: INPUT_TYPES.int,
            }} />
            <TSelect {...{
              ...getFormChangeSelectProps('imapSecure'),
              label: intlObject.intl.formatMessage(messages.imapSecure),
            }} />
            <TInput {...{
              ...getFormChangeInputProps('smtpHost'),
              label: intlObject.intl.formatMessage(messages.smtpHost),
            }} />
            <TInput {...{
              ...getFormChangeInputProps('smtpPort'),
              label: intlObject.intl.formatMessage(messages.smtpPort),
              type: INPUT_TYPES.int,
            }} />
            <TSelect {...{
              ...getFormChangeSelectProps('smtpSecure'),
              label: intlObject.intl.formatMessage(messages.smtpSecure),
            }} />
            <TCheckbox {...{
              value: getNestedObjectField(editMailboxesForm, 'shared'),
              onChange: value => editMailboxesFormActions.changeField('shared', value),
              label: intlObject.intl.formatMessage(messages.shared),
            }} />
            {nonFieldErrors}
            <div {...{
              className: style.buttonWrap,
            }} >
              <TButton {...{
                className: style.buttonAdd,
                onClick: editMailboxesFormActions.submit,
                label: intlObject.intl.formatMessage(
                  editMailboxesForm.id ? localeService.generalMessages.edit : localeService.generalMessages.create,
                ),
                disabled: !editMailboxesFormValid,
              }} />
              <TButton {...{
                className: style.buttonCancel,
                label: intlObject.intl.formatMessage(localeService.generalMessages.cancel),
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
