export const MAIL_API_NAME = 'mailService'
export const MAIL_API_HOST =
  process.env.MAIL_API_HOST || `//${typeof window !== 'undefined' ? window.location.host : ''}`
export const MAIL_API_PREFIX = '/mail/api/v1.0/'

export const MAIL_ALLOWED_NO_TOKEN_ENDPOINTS = [
]

export const MAILBOXES_ENDPOINT = 'mailboxes/'
export const MAILS_ENDPOINT = 'mails/'
export const FOLDERS_ENDPOINT = 'folders/'
export const CONTACTS_ENDPOINT = 'contacts/'
export const CHAINS_ENDPOINT = 'chains/'
