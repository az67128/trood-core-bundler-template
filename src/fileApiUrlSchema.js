export const FILE_API_NAME = 'fileservice'
export const FILE_API_HOST =
  process.env.FILE_API_HOST || `//${typeof window !== 'undefined' ? window.location.host : ''}`
export const FILE_API_PREFIX = '/fileservice/api/v1.0/'

export const FILE_ALLOWED_NO_TOKEN_ENDPOINTS = [
]

export const FILES_ENDPOINT = 'files/'
