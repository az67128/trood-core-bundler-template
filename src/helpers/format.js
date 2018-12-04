import { isDef, isDefAndNotNull } from '$trood/helpers/def'
import { DEFAULT_PHONE_LENGTH } from '$trood/mainConstants'


const dimRegexp = /\B(?=(\d{3})+(?!\d))/g

export const toNumber = (value, trim) => {
  let parts = (isDefAndNotNull(value) ? value.toString() : '').replace(/[^-\d.,]/g, '').split(/\.|,/)
  parts[0] = parts[0].replace(dimRegexp, ' ')
  parts[1] = parts.slice(1, parts.length).join('')
  if (parts[1] && isDef(trim)) parts[1] = parts[1].slice(0, trim)
  parts = parts.slice(0, 2).filter(p => p.length)
  return parts.join(',')
}

export const fromNumber = (value, trim) => {
  let parts = (isDefAndNotNull(value) ? value.toString() : '').replace('.', ',').replace(/[^\d,]/g, '').split(',')
  if (parts[1] && isDef(trim)) parts[1] = parts[1].slice(0, trim)
  parts = parts.filter(p => p.length)
  return parts.join('.')
}

const billion = 1000000
export const prettyNumber = (number, round, trimDim) => {
  let wasRounded = false
  let roundedValue = number
  if (round && number >= billion) {
    roundedValue = Math.round(roundedValue / billion * 10) / 10
    wasRounded = true
  }
  let result = toNumber(roundedValue.toString())
  if (wasRounded && !trimDim) {
    result += ' mln'
  }
  return result
}

const phoneFormat = '(...) ...-..-..'
const timeFormat = '..:..'
const timeRangeFormat = `${timeFormat}-${timeFormat}`

const noDigitsRegexp = /[^\d]/g

const toFormat = (format) => (value = '') => {
  return format.split('').reduce((memo, char) => {
    if (memo.remainingText.length === 0) {
      return memo
    }
    if (char !== '.') {
      return {
        formattedText: memo.formattedText + char,
        remainingText: memo.remainingText,
      }
    }

    return {
      formattedText: memo.formattedText + memo.remainingText[0],
      remainingText: memo.remainingText.slice(1, memo.remainingText.length),
    }
  }, {
    formattedText: '',
    remainingText: value.replace(noDigitsRegexp, ''),
  }).formattedText
}

const fromFormat = (replacementRegex, len, fromEnd) => value => {
  if (fromEnd) return value.replace(replacementRegex, '').slice(-len)
  return value.replace(replacementRegex, '').slice(0, len)
}

/**
 * @func toPhone
 * @description Format string to phone
 * @param {String} value
 * @return {String} String in phone format
 */
export const toPhone = toFormat(phoneFormat)

/**
 * @func fromPhone
 * @description Unformat string from phone
 * @param {String} value
 * @return {String}
 */
export const fromPhone = fromFormat(noDigitsRegexp, DEFAULT_PHONE_LENGTH)

export const toTime = toFormat(timeFormat)
export const fromTime = fromFormat(noDigitsRegexp, 4, true)

export const toTimeRange = toFormat(timeRangeFormat)
export const fromTimeRange = fromFormat(noDigitsRegexp, 8)

export const humanizeNumber = (number, once, twice, many, zero) => {
  if (number === 0 && zero !== undefined) return zero
  const rest100 = number % 100
  const rest10 = number % 10
  if (rest100 > 10 && rest100 < 15) return `${number} ${many}`
  if (rest10 === 1) return `${number} ${once}`
  if (rest10 > 1 && rest10 < 5) return `${number} ${twice}`
  return `${number} ${many}`
}

export const formatSize = (length) => {
  const type = ['Б', 'Кб', 'Мб', 'Гб', 'Тб']
  let i = 0
  let newLength = length
  while (newLength && Math.round(newLength / 1024) > 0 && i < type.length - 1) {
    newLength /= 1024
    i += 1
  }
  return `${Math.round(newLength)} ${type[i]}`
}

const postfixArray = ['', 'млн.', 'млрд.', 'трлн.']

export const toMoney = value => {
  const money = +value
  if (Math.round(money / 1000) < 1000) return { value: money, postfix: '' }
  let i = 0
  let formatValue = money
  let postfixValue = postfixArray[i]
  while (Math.round(formatValue) >= 1000) {
    postfixValue = postfixArray[i]
    formatValue = Math.round(formatValue / 100) / 10
    i += 1
    if (i + 1 > postfixArray.length) break
  }

  return { value: formatValue, postfix: postfixValue }
}

export const getTagsFromHtml = (html = '') => {
  const allTagsString = html.match(/<([a-z0-9]+)[^>]*>/gi) || []
  const allTags = []
  allTagsString.forEach(item => {
    const tag = item.match(/<([a-z0-9]+)[^>]*>/i)[1]
    if (tag && !allTags.includes(tag)) allTags.push(tag)
  })
  return allTags
}

export const html2text = (html = '') => html.replace(/<(?:.|\n)*?>/gm, ' ').replace(/\s+/gm, ' ')
