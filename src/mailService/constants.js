import React from 'react'
import moment from 'moment'
import { defineMessages } from 'react-intl'

import { isDefAndNotNull } from '$trood/helpers/def'

import { ICONS_TYPES } from '$trood/components/TIcon'


export const messages = defineMessages({
  newMessage: {
    id: 'mailService.new_message',
    defaultMessage: 'New message',
  },
  inbox: {
    id: 'mailService.inbox',
    defaultMessage: 'Inbox',
  },
  outbox: {
    id: 'mailService.outbox',
    defaultMessage: 'Outbox',
  },
  settings: {
    id: 'mailService.settings',
    defaultMessage: 'Settings',
  },
  from: {
    id: 'mailService.from',
    defaultMessage: 'From',
  },
  to: {
    id: 'mailService.to',
    defaultMessage: 'To',
  },
  subject: {
    id: 'mailService.subject',
    defaultMessage: 'Subject',
  },
  cc: {
    id: 'mailService.cc',
    defaultMessage: 'CC',
  },
  bcc: {
    id: 'mailService.bcc',
    defaultMessage: 'BCC',
  },
  messageText: {
    id: 'mailService.message_text',
    defaultMessage: 'Message text...',
  },
  attachedMail: {
    id: 'mailService.attached_mail',
    defaultMessage: 'attached_mail',
  },
  send: {
    id: 'mailService.send',
    defaultMessage: 'Send',
  },
  fromWithValue: {
    id: 'mailService.from_with_value',
    defaultMessage: 'From: {emails}',
  },
  toWithValue: {
    id: 'mailService.to_with_value',
    defaultMessage: 'To: {emails}',
  },
  subjectWithValue: {
    id: 'mailService.subject_with_value',
    defaultMessage: 'Subject: {subject}',
  },
  dateWithValue: {
    id: 'mailService.date_with_value',
    defaultMessage: 'Date: {date}',
  },
  reply: {
    id: 'mailService.reply',
    defaultMessage: 'Reply',
  },
  forward: {
    id: 'mailService.forward',
    defaultMessage: 'Forward',
  },
  delete: {
    id: 'mailService.delete',
    defaultMessage: 'Delete',
  },
  folderSettings: {
    id: 'mailService.folder_settings',
    defaultMessage: 'Folder settings',
  },
  folder: {
    id: 'mailService.folder',
    defaultMessage: 'Folder',
  },
  folders: {
    id: 'mailService.folders',
    defaultMessage: 'Folders',
  },
  moveToFolder: {
    id: 'mailService.move_to_folder',
    defaultMessage: 'Move to folder',
  },
  folderName: {
    id: 'mailService.folder_name',
    defaultMessage: 'Folder name',
  },
  mailBoxSettings: {
    id: 'mailService.mail_box_settings',
    defaultMessage: 'Mail box settings',
  },
  mailBox: {
    id: 'mailService.mail_box',
    defaultMessage: 'Mail box',
  },
  mailBoxName: {
    id: 'mailService.mail_box_name',
    defaultMessage: 'Name',
  },
  email: {
    id: 'mailService.email',
    defaultMessage: 'E-Mail',
  },
  password: {
    id: 'mailService.password',
    defaultMessage: 'Password',
  },
  imapHost: {
    id: 'mailService.imap_host',
    defaultMessage: 'Imap Host',
  },
  imapPort: {
    id: 'mailService.imap_port',
    defaultMessage: 'Imap Port',
  },
  imapSecure: {
    id: 'mailService.imap_secure',
    defaultMessage: 'Imap Secure',
  },
  smtpHost: {
    id: 'mailService.smtp_host',
    defaultMessage: 'Smtp Host',
  },
  smtpPort: {
    id: 'mailService.smtp_port',
    defaultMessage: 'Smtp Port',
  },
  smtpSecure: {
    id: 'mailService.smtp_secure',
    defaultMessage: 'Smtp Secure',
  },
  shared: {
    id: 'mailService.shared',
    defaultMessage: 'Shared',
  },
  'This field must be unique.': {
    id: 'mailService.not_unique',
    defaultMessage: 'Email already exists',
  },
  'Enter a valid email address.': {
    id: 'mailService.invalid_mail',
    defaultMessage: 'Enter a valid email address',
  },
  'SMTP server login error: invalid email or password': {
    id: 'mailService.invalid_auth',
    defaultMessage: 'Invalid email or password',
  },
  'Smtp Connection settings wrong: [Errno -2] Name or service not known': {
    id: 'mailService.invalid_host',
    defaultMessage: 'Please make sure that Host is correct',
  },
  'Smtp Connection settings wrong: [Errno 99] Cannot assign requested address': {
    id: 'mailService.invalid_port',
    defaultMessage: 'Please make sure that Port is correct',
  },
  'Smtp Connection settings wrong: Connection unexpectedly closed: timed out': {
    id: 'mailService.host_error',
    defaultMessage: 'Could not connect to mail server. Check smtp/imap settings',
  },
  'Ensure this value is less than or equal to 64535.': {
    id: 'mailService.port_error',
    defaultMessage: 'Please make sure that Port less then 64536',
  },
})

export const SERVICE_NAME = 'mailService'

export const FOLDER_INBOX = 'inbox'
export const FOLDER_OUTBOX = 'outbox'

export const SETTINGS_MAIL_MODAL = 'modalSettingsMailService'
export const EDIT_MAIL_MODAL = 'modalEditMail'
export const MOVE_MAIL_MODAL = 'modalMoveMail'
const EDIT_MAIL_FORM_NAME = 'editMail'
export const getMailFormName = (to) => `${EDIT_MAIL_FORM_NAME}/${isDefAndNotNull(to) ? to.toString() : ''}`

export const getHtmlMailInfo = (mail, intl) => {
  const from = `<p>${intl.formatMessage(messages.fromWithValue, { emails: mail.fromAddress.join(', ') })}</p>`
  const created = `<p>${intl.formatMessage(messages.dateWithValue, {
    date: intl.formatDate(
      moment(mail.createdAt),
      {
        hour12: false,
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      },
    ),
  })}</p>`
  const subject = `<p>${intl.formatMessage(messages.subjectWithValue, { subject: mail.subject })}</p>`
  const to = `<p>${intl.formatMessage(messages.toWithValue, { emails: mail.to.join(', ') })}</p>`
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
export const TROOD_MAIL_SERVICE_PAGE_DEFAULT_TITLE = 'Mail'
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
