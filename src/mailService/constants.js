import React from 'react'
import moment from 'moment'
import { isDefAndNotNull } from '$trood/helpers/def'

import { ICONS_TYPES } from '$trood/components/TIcon'

export const SERVICE_NAME = 'mailService'

export const FOLDER_INBOX = 'inbox'
export const FOLDER_OUTBOX = 'outbox'

export const SETTINGS_MAIL_MODAL = 'modalSettingsMailService'
export const EDIT_MAIL_MODAL = 'modalEditMail'
export const MOVE_MAIL_MODAL = 'modalMoveMail'
const EDIT_MAIL_FORM_NAME = 'editMail'
export const getMailFormName = (to) => `${EDIT_MAIL_FORM_NAME}/${isDefAndNotNull(to) ? to.toString() : ''}`

export const getHtmlMailInfo = mail => {
  const from = `<p>От кого: ${mail.fromAddress.join(', ')}</p>`
  const created = `<p>Дата: ${moment(mail.createdAt).format('DD MMMM YYYY [г.,] HH:mm')}</p>`
  const subject = `<p>Тема: ${mail.subject}</p>`
  const to = `<p>Кому: ${mail.to.join(', ')}</p>`
  return `${from}${created}${subject}${to}`
}

export const formatAttachedMail = attachedMail => {
  if (!attachedMail) return ''
  return `<blockquote style="border-left: 1px solid #ccc; padding-left: 0.5em; margin-left: 0.5em;">${
    attachedMail
  }</blockquote>`
}

const defaultMailServiceContext = {
  mailServiceActions: {},
}

export const MailServiceContext = React.createContext(defaultMailServiceContext)

export const TROOD_MAIL_SERVICE_PAGE_ID = 'troodMailService'
export const TROOD_MAIL_SERVICE_PAGE_DEFAULT_TITLE = 'Почта'
export const TROOD_MAIL_SERVICE_PAGE_DEFAULT_ICON = ICONS_TYPES.mail

const SSL = 'ssl'
const TLS = 'tls'

export const ENCRYPTION_TYPES = {
  [SSL]: SSL,
  [TLS]: TLS,
}

export const EDIT_MAILBOX_FORM_NAME = 'editMailboxesForm'
export const EDIT_FOLDER_FORM_NAME = 'editFolderForm'

const FOLDERS = 'folders'
const MAILBOXES = 'mailboxes'

export const SETTINGS_FOR = {
  [FOLDERS]: FOLDERS,
  [MAILBOXES]: MAILBOXES,
}

export const ERROR_MESSAGES = {
  'This field must be unique.': 'Такой Email уже существует',
  'Enter a valid email address.': 'Введите корректный электронный адрес.',
  'SMTP server login error: invalid email or password':
    'Неверный Email или пароль',
  'Smtp Connection settings wrong: [Errno -2] Name or service not known':
    'Убедитесь, что поле Host правильно.',
  'Smtp Connection settings wrong: [Errno 99] Cannot assign requested address':
    'Убедитесь, что поле Port правильно.',
  'Smtp Connection settings wrong: Connection unexpectedly closed: timed out':
    'Не удалось подключится к почтовому серверу, проверьте настройки smpt/imap',
  'Ensure this value is less than or equal to 64535.':
    'Убедитесь, что это значение поля Port меньше или равно 64535.',
}
