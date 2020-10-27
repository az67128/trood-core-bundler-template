import moment from 'moment'

import { DEFAULT_DATE_TIME_FORMAT } from '../internal/constants'

export const PERIOD_ALL = 'all'
export const PERIOD_CURRENT_DAY = 'currentDay'
export const PERIOD_CURRENT_WEEK = 'currentWeek'
export const PERIOD_CURRENT_MONTH = 'currentMonth'
export const PERIOD_CURRENT_YEAR = 'currentYear'
export const PERIOD_CUSTOM = 'custom'

export const PERIOD_TYPES = {
  [PERIOD_ALL]: 'All time',
  [PERIOD_CURRENT_DAY]: 'Current day',
  [PERIOD_CURRENT_WEEK]: 'Current week',
  [PERIOD_CURRENT_MONTH]: 'Current month',
  [PERIOD_CURRENT_YEAR]: 'Current year',
  [PERIOD_CUSTOM]: 'Custom',
}

export const DEFAULT_PERIODS = Object.keys(PERIOD_TYPES)

const periodSelectorFunctions = {
  [PERIOD_ALL]: () => {
    return {
      startDate: moment('1900-01-01').format(DEFAULT_DATE_TIME_FORMAT),
      endDate: moment().add({ year: 1 }).format(DEFAULT_DATE_TIME_FORMAT),
    }
  },
  [PERIOD_CURRENT_DAY]: () => {
    return {
      startDate: moment().startOf('day').format(DEFAULT_DATE_TIME_FORMAT),
      endDate: moment().endOf('day').format(DEFAULT_DATE_TIME_FORMAT),
    }
  },
  [PERIOD_CURRENT_WEEK]: () => {
    return {
      startDate: moment().startOf('week').format(DEFAULT_DATE_TIME_FORMAT),
      endDate: moment().endOf('week').format(DEFAULT_DATE_TIME_FORMAT),
    }
  },
  [PERIOD_CURRENT_MONTH]: () => {
    return {
      startDate: moment().startOf('month').format(DEFAULT_DATE_TIME_FORMAT),
      endDate: moment().endOf('month').format(DEFAULT_DATE_TIME_FORMAT),
    }
  },
  [PERIOD_CURRENT_YEAR]: () => {
    return {
      startDate: moment().startOf('year').format(DEFAULT_DATE_TIME_FORMAT),
      endDate: moment().endOf('year').format(DEFAULT_DATE_TIME_FORMAT),
    }
  },
  [PERIOD_CUSTOM]: () => {
    return {
      startDate: moment().startOf('month').format(DEFAULT_DATE_TIME_FORMAT),
      endDate: moment().endOf('month').format(DEFAULT_DATE_TIME_FORMAT),
    }
  },
}

export const getPeriodSelector = (period) => periodSelectorFunctions[period]()
