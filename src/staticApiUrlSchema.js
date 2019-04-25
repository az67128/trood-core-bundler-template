export const STATIC_API_NAME = 'static'
export const STATIC_API_HOST =
  process.env.STATIC_API_HOST || `//${typeof window !== 'undefined' ? window.location.host : ''}`

export const STATIC_API_PREFIX = process.env.PUBLIC_URL

export const STATIC_ALLOWED_NO_TOKEN_ENDPOINTS = [
  /.*/,
]
