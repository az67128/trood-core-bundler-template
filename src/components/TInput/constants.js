import * as format from '$trood/helpers/format'

import { EMAIL_REGEXP } from '$trood/mainConstants'


const TEXT = 'text'
const INT = 'int'
const FLOAT = 'float'
const MULTI = 'multi'
const WYSIWYG = 'wysiwyg'
const PASSWORD = 'password'
const PHONE = 'phone'
const PHONE_WITH_EXT = 'phoneWithExt'
const MONEY = 'money'
const MONEY_NUMBER = 'moneyNumber'
const EMAIL = 'email'
const DATE = 'date'
const URL = 'url'
const COLOR = 'color'
const SEARCH = 'search'
const TIME = 'time'

export const INPUT_TYPES = {
  [TEXT]: TEXT,
  [INT]: INT,
  [FLOAT]: FLOAT,
  [MULTI]: MULTI,
  [WYSIWYG]: WYSIWYG,
  [PASSWORD]: PASSWORD,
  [PHONE]: PHONE,
  [PHONE_WITH_EXT]: PHONE_WITH_EXT,
  [MONEY]: MONEY,
  [MONEY_NUMBER]: MONEY_NUMBER,
  [EMAIL]: EMAIL,
  [DATE]: DATE,
  [URL]: URL,
  [COLOR]: COLOR,
  [SEARCH]: SEARCH,
  [TIME]: TIME,
}

export const INNER_INPUT_TYPES = {
  [TEXT]: TEXT,
  [INT]: TEXT,
  [FLOAT]: TEXT,
  [PASSWORD]: PASSWORD,
  [PHONE]: TEXT,
  [PHONE_WITH_EXT]: TEXT,
  [MONEY]: TEXT,
  [MONEY_NUMBER]: TEXT,
  [EMAIL]: TEXT,
  [DATE]: TEXT,
  [URL]: TEXT,
  [COLOR]: TEXT,
  [SEARCH]: TEXT,
  [TIME]: TEXT,
}

export const VALIDATION_FORMATS = {
  [EMAIL]: EMAIL_REGEXP,
  [COLOR]: /^#?((\d|[a-f]){3}|(\d|[a-f]){6})?$/i,
  [TIME]: /([0-1]\d[0-5]\d)|(2[0-3][0-5]\d)/,
}

export const ERROR_TYPES = {
  email: 'Введите корректный email!',
  color: 'Введите корректный hex-код!',
  url: 'Введите корректный url!',
  format: 'Вы ввели неправильное значение!',
  maxLen: 'Максимальная длина: ',
  minLen: 'Минимальная длина: ',
  required: 'Это поле обязательно!',
}

export const FLOAT_MAX_FRACTIONALS = 6
export const MONEY_MAX_FRACTIONALS = 2
export const formatToFunctions = {
  [FLOAT]: (value, maxFractionals = FLOAT_MAX_FRACTIONALS) => {
    const valueString = value.toString()
    let number = format.toNumber(value, maxFractionals)
    if (maxFractionals > 0 && (valueString.endsWith(',') || valueString.endsWith('.'))) {
      number = `${number},`
    }
    return number
  },
  [INT]: value => formatToFunctions[FLOAT](value, 0),
  [MONEY]: value => formatToFunctions[FLOAT](value, MONEY_MAX_FRACTIONALS),
  [MONEY_NUMBER]: value => formatToFunctions[FLOAT](value, MONEY_MAX_FRACTIONALS),
  [PHONE]: format.toPhone,
  [PHONE_WITH_EXT]: format.toPhone,
  [DATE]: format.toDate,
  [URL]: value => {
    return value.replace(/https?:\/\//ig, '')
  },
  [COLOR]: value => {
    return value.replace(/#/ig, '')
  },
  [TIME]: format.toTime,
}

export const formatFromFunctions = {
  [FLOAT]: (value, toType = true, maxFractionals = FLOAT_MAX_FRACTIONALS) => {
    const formatted = format.fromNumber(value, maxFractionals)
    if (!toType) return formatted
    return formatted === '-' ? 0 : +formatted
  },
  [INT]: (value, toType = true) => formatFromFunctions[FLOAT](value, toType, 0),
  [MONEY]: value => formatFromFunctions[FLOAT](value, false, MONEY_MAX_FRACTIONALS),
  [MONEY_NUMBER]: (value, toType = true) => formatFromFunctions[FLOAT](value, toType, MONEY_MAX_FRACTIONALS),
  [PHONE]: format.fromPhone,
  [PHONE_WITH_EXT]: value => format.fromPhone(value, -1),
  [DATE]: format.fromDate,
  [URL]: value => `http://${value.replace(/https?:\/\//ig, '')}`,
  [COLOR]: value => `#${value.replace(/#/ig, '')}`,
  [TIME]: format.fromTime,
}

export const formatLengthFunctions = {
  [PHONE]: format.getPhoneFormatLength,
  [PHONE_WITH_EXT]: format.getPhoneFormatLength,
}

const intRegexp = /[\d\u002d]/
const floatRegexp = /[\d\u002c\u002d\u002e]/

export const includeForTypes = {
  [INT]: intRegexp,
  [FLOAT]: floatRegexp,
  [PHONE]: /\d/,
  [PHONE_WITH_EXT]: /\d/,
  [MONEY]: floatRegexp,
  [MONEY_NUMBER]: floatRegexp,
  [DATE]: /\d/,
  [COLOR]: /[\da-f]/i,
  [TIME]: /\d/,
}

export const excludeForTypes = {}

export const ROW_HEIGHT = 18

export const DEFAULT_MAX_ROWS = 5

export const checkTime = (timeStr) => {
  const hoursStr = timeStr.slice(0, 2)
  const minutesStr = timeStr.slice(2, 4)
  const hours = Number(hoursStr)
  const minutes = Number(minutesStr)

  const isValidHour = Number.isInteger(hours) && hours >= 0 && hours < 24
  if (!isValidHour) return false

  if (!Number.isNaN(minutes) && minutes > 10 && Number(minutesStr[0]) > 5) {
    return false
  }

  return true
}
