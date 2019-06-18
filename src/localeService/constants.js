import { snakeToCamel } from '$trood/helpers/namingNotation'

export const DEFAULT_LOCALE = 'en'

export const intlObject = {
  intl: undefined,
}

export const intlRenderCallback = intl => {
  intlObject.intl = intl
}

export const translateDictionary = (dict = {}) => (item = {}) => {
  const message = dict[snakeToCamel(item.code)]
  if (!intlObject.intl || !message) return item.name
  return intlObject.intl.formatMessage(message)
}
