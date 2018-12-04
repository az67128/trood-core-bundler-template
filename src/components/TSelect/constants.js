import escapeRegExp from 'lodash/escapeRegExp'

export const DEFAULT_MAX_ROWS = 5

export const EMPTY_ITEMS_LABEL = 'Пусто'

export const mapDictToOptions = (dict, intl) => {
  return Object.keys(dict).map(value => ({
    value,
    label: typeof dict[value] === 'object' ? intl.formatMessage(dict[value]) : dict[value],
  }))
}

export const mapArrayToOptions = (array, intl) => {
  return array.map(value => ({
    value: typeof value === 'object' ? intl.formatMessage(value) : value,
  }))
}

export const defaultFilterFunction = (search, array) => {
  if (!search) return undefined
  const regExp = new RegExp(escapeRegExp(search), 'im')
  const values = array.filter(item => regExp.test(item.label))
  return Promise.resolve(values)
}

const SELECT_DROPDOWN = 'dropdown'
const SELECT_FILTER_DROPDOWN = 'filterDropdown'
const SELECT_TILE = 'tile'
const SELECT_RADIO = 'radio'
const SELECT_CHECKBOX = 'checkbox'
const SELECT_TOGGLE = 'toggle'

export const SELECT_TYPES = {
  [SELECT_DROPDOWN]: SELECT_DROPDOWN,
  [SELECT_FILTER_DROPDOWN]: SELECT_FILTER_DROPDOWN,
  [SELECT_TILE]: SELECT_TILE,
  [SELECT_RADIO]: SELECT_RADIO,
  [SELECT_CHECKBOX]: SELECT_CHECKBOX,
  [SELECT_TOGGLE]: SELECT_TOGGLE,
}

const RADIO_VERTICAL = 'vertical'
const RADIO_HORIZONTAL = 'horizontal'

export const RADIO_GROUP_TYPES = {
  [RADIO_VERTICAL]: RADIO_VERTICAL,
  [RADIO_HORIZONTAL]: RADIO_HORIZONTAL,
}

export const ERROR_TYPES = {
  required: 'Это поле обязательно!',
}
