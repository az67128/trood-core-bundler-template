export const INIT_ACTION = '@@INIT'
export const ROUTER_LOCATION_CHANGE_ACTION = '@@router/LOCATION_CHANGE'
export const STATE_REPLACE_ACTION = 'STATE_REPLACE'

export const EMAIL_REGEXP = /[^@]+@[^@]+\.[^@]+|^$/
export const UUID_REGEXP = /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}/
export const WHOLE_STRING_UUID_REGEXP = new RegExp(`^${UUID_REGEXP.source}$`)
export const DEFAULT_PHONE_LENGTH = 10

export const KEY_CODES = {
  backspace: 8,
  enter: 13,
  esc: 27,
  arrowLeft: 37,
  arrowRight: 39,
  delete: 46,
}

export const SEARCH_DEBOUNCE = 500
export const DISPATCH_DEBOUNCE = 50

export const DEFAULT_DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm:ss.SZ'
export const DEFAULT_DATE_FORMAT = 'YYYY-MM-DD'

export const DEFAULT_SCROLLING_CONTAINER_ID = 'troodAppScroll'
