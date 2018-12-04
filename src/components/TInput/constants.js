import * as format from '$trood/helpers/format'

import { EMAIL_REGEXP } from '$trood/mainConstants'


const TEXT = 'text'
const NUMBER = 'number'
const MULTI = 'multi'
const WYSIWYG = 'wysiwyg'
const PASSWORD = 'password'
const PHONE = 'phone'
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
  [NUMBER]: NUMBER,
  [MULTI]: MULTI,
  [WYSIWYG]: WYSIWYG,
  [PASSWORD]: PASSWORD,
  [PHONE]: PHONE,
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
  [NUMBER]: TEXT,
  [PASSWORD]: PASSWORD,
  [PHONE]: TEXT,
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

export const MAX_FRACTIONALS = 2
export const formatToFunctions = {
  [NUMBER]: value => value.toString(),
  [PHONE]: format.toPhone,
  [MONEY]: value => {
    let number = format.toNumber(value, MAX_FRACTIONALS)
    if (value.endsWith(',') || value.endsWith('.')) {
      number = `${number},`
    }
    return number
  },
  [MONEY_NUMBER]: value => {
    return formatToFunctions[MONEY](value ? value.toString() : '0')
  },
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
  [PHONE]: format.fromPhone,
  [NUMBER]: value => {
    return (value === '' || value === '-') ? value : +value
  },
  [MONEY]: value => format.fromNumber(value, MAX_FRACTIONALS),
  [MONEY_NUMBER]: (value) => {
    const formatted = formatFromFunctions[MONEY](value)
    return parseFloat(formatted || 0)
  },
  [DATE]: format.fromDate,
  [URL]: value => `http://${value.replace(/https?:\/\//ig, '')}`,
  [COLOR]: value => `#${value.replace(/#/ig, '')}`,
  [TIME]: format.fromTime,
}

export const includeForTypes = {
  [NUMBER]: /\d|-/,
  [PHONE]: /\d/,
  [MONEY]: /\d|\.|,/,
  [DATE]: /\d|\.| /,
  [COLOR]: /\d|[a-f]/i,
  [TIME]: /[\d]/,
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
