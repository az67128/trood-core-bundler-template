export const JOURNAL_API_NAME = 'journalservice'
export const JOURNAL_API_HOST =
  process.env.JOURNAL_API_HOST || `//${typeof window !== 'undefined' ? window.location.host : ''}`
export const JOURNAL_API_PREFIX = '/journal/api/v1.0/'

export const JOURNAL_ALLOWED_NO_TOKEN_ENDPOINTS = [
]

export const JOURNALS_ENDPOINT = 'journals/'
export const HISTORY_ENDPOINT = 'history/'
